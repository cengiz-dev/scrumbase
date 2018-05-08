import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';
import { Observable } from 'rxjs/Observable';

import { DataService } from './data.service';
import './observable.from-thenable';
import { User } from '../model/user.model';
import { Project, ProjectRef } from '../model/project.model';
import { Epic } from '../model/epic.model';
import { Feature } from '../model/feature.model';
import { Task, TaskSummary, task2TaskSummary } from '../model/task.model';
import { TransactionResult } from '@firebase/database/dist/esm/src/api/TransactionResult';

@Injectable()
export class FirebaseDataService extends DataService {
  constructor(private db: AngularFireDatabase) {
    super();
  }

  getProjectsFromBackend(): Observable<ProjectRef[]> {
    return this.db.list(ProjectRef.COLLECTION_NAME).snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.val() as ProjectRef;
          data.key = a.payload.key;
          return data;
        });
      });
  }

  addProjectToBackend(project: Project, user: User): Observable<any> {
    project.createdOn = database.ServerValue.TIMESTAMP;
    project.createdBy = user;
    project.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    project.lastUpdatedBy = user;
    return Observable.fromThenable(this.db.list(ProjectRef.COLLECTION_NAME).push(project));
  }

  updateProjectInBackend(project: ProjectRef, user: User): Promise<void> {
    project.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    project.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.key, { ...project });
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

  updateEpicInBackend(project: ProjectRef, updatedEpic: Epic, epicIndex: number, user: User): Promise<void> {
    let epic: Epic;
    if (project.epics && epicIndex < project.epics.length) {
      epic = project.epics[epicIndex] = {
        ...updatedEpic
      };
    } else {
      throw { message: "Epic index out of bounds. Can't update epic." };
    }
    epic.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    epic.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.key, { epics: project.epics });
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

    return this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}`).snapshotChanges().take(1).map(a => {
      const data = a.payload.val();
      if (data && data[feature.taskPrefix]) {
        throw { message: `Prefix ${feature.taskPrefix} already exists for project ${project.title}` };
      }
      let features = epic.features ? [...epic.features, feature] : [feature];
      this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}/${feature.taskPrefix}`).update({ count: 0 })
        .then(() => this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}`).update({ features: features }));
    });
  }

  updateFeatureInBackend(project: ProjectRef, updatedFeature: Feature, epicIndex: number, featureIndex: number, user: User): Promise<void> {
    let feature: Feature;
    if (!project.epics || epicIndex >= project.epics.length) {
      throw { message: "Epic index out of bounds. Can't update feature." };
    } else if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
      throw { message: "Feature index out of bounds. Can't update feature." };
    } else {
      feature = project.epics[epicIndex].features[featureIndex] = {
        ...updatedFeature
      };
    }
    feature.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    feature.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.key, { epics: project.epics });
  }

  getTaskFromBackend(key: string): Observable<Task | null> {
    return this.db.list(Task.COLLECTION_NAME, ref => ref.equalTo(null, key)).snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.val() as Task;
          data.key = a.payload.key;
          return data;
        });
      })
      .map(v => v && v.length > 0 ? v[0] : null);
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
    task.createdOn = task.lastUpdatedOn = feature.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    task.createdBy = task.lastUpdatedBy = feature.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    let countRef = this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}/${feature.taskPrefix}/count`).query.ref;
    return Observable.fromPromise(
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

  updateTaskInBackend(project: ProjectRef, updatedTask: Task, epicIndex: number, featureIndex: number,
    taskIndex: number, user: User): Observable<any> {
    updatedTask.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    updatedTask.lastUpdatedBy = user;
    if (!project.epics || epicIndex >= project.epics.length) {
      throw { message: "Epic index out of bounds. Can't update task." };
    } else if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
      throw { message: "Feature index out of bounds. Can't update task." };
    } else if (!project.epics[epicIndex].features[featureIndex].tasks || taskIndex >= project.epics[epicIndex].features[featureIndex].tasks.length) {
      throw { message: "Task index out of bounds. Can't update task." };
    } else {
      project.epics[epicIndex].features[featureIndex].tasks[taskIndex] = task2TaskSummary(updatedTask);
    }
    const tasks = this.db.list(Task.COLLECTION_NAME);
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return Observable.fromPromise(tasks.update(updatedTask.key, { ...updatedTask }))
      .merge(projects.update(project.key, { epics: project.epics }));
  }
}
