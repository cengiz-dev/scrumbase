import { from as observableFrom, Observable } from 'rxjs';

import { take, map, merge, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';

import { DataService } from './data.service';
import { User } from '../model/user.model';
import { Project, ProjectRef, ProjectUpdate } from '../model/project.model';
import { Epic, EpicUpdate } from '../model/epic.model';
import { Feature, FeatureUpdate } from '../model/feature.model';
import { Task, TaskSummary, task2TaskSummary, TaskUpdate, taskSummaryUpdatesFromTaskUpdate, TaskParent } from '../model/task.model';
import { TransactionResult } from '@firebase/database/dist/src/api/TransactionResult';
import { TaskStatus } from '../model/task-status.model';

@Injectable()
export class FirebaseDataService extends DataService {
  constructor(private db: AngularFireDatabase) {
    super();
  }

  getProjectsFromBackend(): Observable<ProjectRef[]> {
    return this.db.list(ProjectRef.COLLECTION_NAME).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.val() as ProjectRef;
          data.key = a.payload.key;
          return data;
        });
      }));
  }

  addProjectToBackend(project: Project, user: User): Observable<any> {
    project.createdOn = database.ServerValue.TIMESTAMP;
    project.createdBy = user;
    project.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    project.lastUpdatedBy = user;
    return observableFrom(this.db.list(ProjectRef.COLLECTION_NAME).push(project));
  }

  updateProjectInBackend(key: string, projectUpdate: ProjectUpdate, user: User): Promise<void> {
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(
      key,
      {
        ...projectUpdate,
        lastUpdatedOn: database.ServerValue.TIMESTAMP,
        lastUpdatedBy: user,
      }
    );
  }

  addEpicInBackend(project: ProjectRef, epic: Epic, user: User): Promise<void> {
    if (!project.epics) {
      project.epics = new Array<Epic>();
    }
    epic.createdOn = epic.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    epic.createdBy = epic.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    let epics = project.epics ? [...project.epics, epic] : [epic];
    return projects.update(project.key, { lastUpdatedOn: database.ServerValue.TIMESTAMP, lastUpdatedBy: user, epics: epics });
  }

  updateEpicInBackend(project: ProjectRef, updatedEpic: EpicUpdate, epicIndex: number, user: User): Promise<void> {
    if (!project.epics || epicIndex >= project.epics.length) {
      throw { message: "Epic index out of bounds. Can't update epic." };
    }
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}`)
      .update({
        ...updatedEpic,
        lastUpdatedOn: database.ServerValue.TIMESTAMP,
        lastUpdatedBy: user,
      });
  }

  addFeatureInBackend(project: ProjectRef, epicIndex: number, feature: Feature, user: User): Observable<any> {
    let epic: Epic;
    if (project.epics && epicIndex < project.epics.length) {
      epic = project.epics[epicIndex];
    } else {
      throw { message: "Epic index out of bounds. Can't add feature." };
    }
    feature.createdOn = feature.lastUpdatedOn = epic.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    feature.createdBy = feature.lastUpdatedBy = epic.lastUpdatedBy = user;

    return this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}`).snapshotChanges().pipe(take(1), map(a => {
      const data = a.payload.val();
      if (data && data[feature.taskPrefix]) {
        throw { message: `Prefix ${feature.taskPrefix} already exists for project ${project.title}` };
      }
      let features = epic.features ? [...epic.features, feature] : [feature];
      this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}/${feature.taskPrefix}`).update({ count: 0 })
        .then(() => this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}`).update({ features: features }));
    }), );
  }

  updateFeatureInBackend(project: ProjectRef, updatedFeature: FeatureUpdate, epicIndex: number, featureIndex: number, user: User): Promise<void> {
    if (!project.epics || epicIndex >= project.epics.length) {
      throw { message: "Epic index out of bounds. Can't update feature." };
    } else if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
      throw { message: "Feature index out of bounds. Can't update feature." };
    }
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}/features/${featureIndex}`)
      .update({
        ...updatedFeature,
        lastUpdatedOn: database.ServerValue.TIMESTAMP,
        lastUpdatedBy: user,
      });
  }

  getTaskFromBackend(key: string): Observable<Task | null> {
    return this.db.list(Task.COLLECTION_NAME, ref => ref.equalTo(null, key)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.val() as Task;
          data.key = a.payload.key;
          return data;
        });
      }),
      map(v => v && v.length > 0 ? v[0] : null), );
  }

  addTaskInBackend(project: ProjectRef, epicIndex: number, featureIndex: number, task: Task, user: User): Observable<any> {
    let feature: Feature;
    if (!project.epics || epicIndex >= project.epics.length) {
      throw { message: "Epic index out of bounds. Can't add task." };
    } else if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
      throw { message: "Feature index out of bounds. Can't add task." };
    } else {
      feature = project.epics[epicIndex].features[featureIndex];
    }
    task.parent = new TaskParent(project.key, epicIndex, featureIndex);
    task.createdOn = task.lastUpdatedOn = feature.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    task.createdBy = task.lastUpdatedBy = feature.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    let countRef = this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}/${feature.taskPrefix}/count`).query.ref;
    return observableFrom(
      countRef.transaction(count => count ? ++count : 1)
        .then((result: TransactionResult) => result.snapshot.val())
        .then(val => {
          task.identifier = `${feature.taskPrefix}-${val}`;
          return task;
        })
        .then(taskToAdd => this.db.list(Task.COLLECTION_NAME).push(taskToAdd))
        .then(addedTaskRef => {
          task.key = addedTaskRef.key;
          let tasks: Array<TaskSummary> = feature.tasks ? [...feature.tasks, task2TaskSummary(task)] : [task2TaskSummary(task)];
          this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}/features/${featureIndex}`)
            .update({ tasks: tasks });
        })
    );
  }

  updateTaskInBackend(project: ProjectRef, taskKey: string, updatedTask: TaskUpdate, epicIndex: number, featureIndex: number,
    taskIndex: number, user: User): Observable<any> {
    if (!project.epics || epicIndex >= project.epics.length) {
      throw { message: "Epic index out of bounds. Can't update task." };
    } else if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
      throw { message: "Feature index out of bounds. Can't update task." };
    } else if (!project.epics[epicIndex].features[featureIndex].tasks || taskIndex >= project.epics[epicIndex].features[featureIndex].tasks.length) {
      throw { message: "Task index out of bounds. Can't update task." };
    }
    const tasks = this.db.list(Task.COLLECTION_NAME);
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    console.log(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}/features/${featureIndex}/tasks/${taskIndex}`, ...taskSummaryUpdatesFromTaskUpdate(updatedTask))
    return observableFrom(tasks.update(taskKey, { ...updatedTask, lastUpdatedOn: database.ServerValue.TIMESTAMP, lastUpdatedBy: user })).pipe(
      merge(this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}/features/${featureIndex}/tasks/${taskIndex}`)
        .update({ ...taskSummaryUpdatesFromTaskUpdate(updatedTask) }))
    );
  }

  deleteTaskInBackend(project: ProjectRef, taskKey: string, user: User): Observable<any> {
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return this.db.object(`${Task.COLLECTION_NAME}/${taskKey}`).snapshotChanges().pipe(
        take(1),
        map(action => ({ ...action.payload.val(), key: action.payload.key } as Task)),
        mergeMap(task => {
          let epicIndex: number, featureIndex: number, taskIndex: number;
          let tasks: Array<TaskSummary>;
          if (task.parent.epicIndex) {
            epicIndex = task.parent.epicIndex;
            if (!project.epics || epicIndex >= project.epics.length) {
              throw { message: "Epic index out of bounds. Can't update task." };
            } else if (task.parent.featureIndex) {
              featureIndex = task.parent.featureIndex;
              if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
                throw { message: "Feature index out of bounds. Can't update task." };
              }
              tasks = project.epics[epicIndex].features[featureIndex].tasks;
            } else {
              tasks = project.epics[epicIndex].tasks;
            }
          } else {
            tasks = project.tasks;
          }

          if (!tasks) {
            throw { message: "Task index out of bounds. Can't update task." };
          } else {
            for (let i = 0; i < tasks.length; i++) {
              if (task.key == taskKey) {
                taskIndex = i;
                break;
              }
            }
          }
          
          if (taskIndex === undefined) {
            throw { message: "Task not found." };
          }

          return observableFrom(this.db.list(Task.COLLECTION_NAME).update(taskKey, { status: TaskStatus.DELETED, lastUpdatedOn: database.ServerValue.TIMESTAMP, lastUpdatedBy: user }))
              .pipe(
                merge(this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}/features/${featureIndex}/tasks/${taskIndex}`).update({ status: TaskStatus.DELETED }))
              );
        })
      );
  }
}
