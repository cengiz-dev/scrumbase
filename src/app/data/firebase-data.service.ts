import { from as observableFrom, Observable } from 'rxjs';

import { take, map, merge, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';
import { TransactionResult } from '@firebase/database/dist/src/api/TransactionResult';

import { DataService } from './data.service';
import { User } from '../model/user.model';
import { Project, ProjectRef, ProjectUpdate } from '../model/project.model';
import { Epic, EpicUpdate } from '../model/epic.model';
import { Feature, FeatureUpdate } from '../model/feature.model';
import { Task, TaskSummary, task2TaskSummary, TaskUpdate, taskSummaryUpdatesFromTaskUpdate, TaskParent } from '../model/task.model';
import { TaskStatus } from '../model/task-status.model';
import { Sprint, SprintUpdate } from '../model/sprint.model';

@Injectable()
export class FirebaseDataService extends DataService {
  constructor(private db: AngularFireDatabase) {
    super();
  }

  protected getProjectsFromBackend(): Observable<ProjectRef[]> {
    return this.db.list(ProjectRef.COLLECTION_NAME).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.val() as ProjectRef;
          data.key = a.payload.key;
          return data;
        });
      }));
  }

  protected addProjectInBackend(project: Project, user: User): Observable<any> {
    project.createdOn = database.ServerValue.TIMESTAMP;
    project.createdBy = user;
    project.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    project.lastUpdatedBy = user;
    return observableFrom(this.db.list(ProjectRef.COLLECTION_NAME).push(project)).pipe(
      mergeMap(addedProjectRef => {
        return this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${addedProjectRef.key}/${project.taskPrefix}`).update({ count: 0 });
      })
    );
  }

  protected updateProjectInBackend(key: string, projectUpdate: ProjectUpdate, user: User): Promise<void> {
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

  protected addEpicInBackend(project: ProjectRef, epic: Epic, user: User): Promise<void> {
    if (!project.epics) {
      project.epics = new Array<Epic>();
    }
    epic.createdOn = epic.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    epic.createdBy = epic.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    let epics = project.epics ? [...project.epics, epic] : [epic];
    return projects.update(project.key, { lastUpdatedOn: database.ServerValue.TIMESTAMP, lastUpdatedBy: user, epics: epics });
  }

  protected updateEpicInBackend(project: ProjectRef, updatedEpic: EpicUpdate, epicIndex: number, user: User): Promise<void> {
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

  protected addFeatureInBackend(project: ProjectRef, epicIndex: number, feature: Feature, user: User): Observable<any> {
    let epic: Epic;
    if (project.epics && epicIndex < project.epics.length) {
      epic = project.epics[epicIndex];
    } else {
      throw { message: "Epic index out of bounds. Can't add feature." };
    }
    feature.createdOn = feature.lastUpdatedOn = epic.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    feature.createdBy = feature.lastUpdatedBy = epic.lastUpdatedBy = user;

    return this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}`).snapshotChanges().pipe(
      take(1),
      map(a => {
        const data = a.payload.val();
        if (data && data[feature.taskPrefix]) {
          throw { message: `Prefix ${feature.taskPrefix} already exists for project ${project.title}` };
        }
        let features = epic.features ? [...epic.features, feature] : [feature];
        this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}/${feature.taskPrefix}`).update({ count: 0 })
          .then(() => this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}`).update({ features: features }));
      })
    );
  }

  protected updateFeatureInBackend(project: ProjectRef, updatedFeature: FeatureUpdate, epicIndex: number, featureIndex: number, user: User): Promise<void> {
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

  protected getTaskFromBackend(key: string): Observable<Task | null> {
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

  protected getTasksFromBackend(keys: Array<string>): Observable<Task[] | null> {
    if (!keys) {
      return new Observable<null>();
    }
    return Observable.combineLatest(keys.map(key => this.db.list(Task.COLLECTION_NAME, ref => ref.equalTo(null, key)).snapshotChanges().pipe(
      map(actions => {
        return !actions ? null : actions.map(a => {
          const data = a.payload.val() as Task;
          data.key = a.payload.key;
          return data;
        });
      }),
      map(v => v && v.length > 0 ? v[0] : null), )));
  }

  protected addTaskInBackend(project: ProjectRef, epicIndex: number, featureIndex: number, task: Task, user: User): Observable<any> {
    if (epicIndex != 0 && !epicIndex) {
      return this.addTaskToProject(project, task, user);
    } else {
      if (!project.epics || epicIndex >= project.epics.length) {
        throw { message: "Epic index out of bounds. Can't add task." };
      }
      if (featureIndex != 0 && !featureIndex) {
        return this.addTaskToEpic(project, epicIndex, task, user);
      } else {
        if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
          throw { message: "Feature index out of bounds. Can't add task." };
        }
        return this.addTaskToFeature(project, epicIndex, featureIndex, task, user);
      }
    }
  }

  protected addTaskToProject(project: ProjectRef, task: Task, user: User): Observable<any> {
    task.parent = { projectKey: project.key };
    task.createdOn = task.lastUpdatedOn = project.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    task.createdBy = task.lastUpdatedBy = project.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    let countRef = this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}/${project.taskPrefix}/count`).query.ref;
    return observableFrom(
      countRef.transaction(count => count ? ++count : 1)
        .then((result: TransactionResult) => {
          task.identifier = `${project.taskPrefix}-${result.snapshot.val()}`;
          return this.db.list(Task.COLLECTION_NAME).push(task);
        })
        .then(addedTaskRef => {
          task.key = addedTaskRef.key;
          let tasks: Array<TaskSummary> = project.tasks ? [...project.tasks, task2TaskSummary(task)] : [task2TaskSummary(task)];
          this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}`).update({ tasks: tasks });
        })
    );
  }

  protected addTaskToEpic(project: ProjectRef, epicIndex: number, task: Task, user: User): Observable<any> {
    let epic = project.epics[epicIndex];
    task.parent = {
      projectKey: project.key,
      epicIndex: epicIndex,
    };
    task.createdOn = task.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    task.createdBy = task.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    let countRef = this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}/${epic.taskPrefix}/count`).query.ref;
    return observableFrom(
      countRef.transaction(count => count ? ++count : 1)
        .then((result: TransactionResult) => {
          task.identifier = `${epic.taskPrefix}-${result.snapshot.val()}`;
          return this.db.list(Task.COLLECTION_NAME).push(task);
        })
        .then(addedTaskRef => {
          task.key = addedTaskRef.key;
          let tasks: Array<TaskSummary> = epic.tasks ? [...epic.tasks, task2TaskSummary(task)] : [task2TaskSummary(task)];
          this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}`)
            .update({ tasks: tasks, lastUpdatedOn: database.ServerValue.TIMESTAMP, lastUpdatedBy: user });
        })
    );
  }

  protected addTaskToFeature(project: ProjectRef, epicIndex: number, featureIndex: number, task: Task, user: User): Observable<any> {
    let feature = project.epics[epicIndex].features[featureIndex];
    task.parent = {
      projectKey: project.key,
      epicIndex: epicIndex,
      featureIndex: featureIndex,
    };
    task.createdOn = task.lastUpdatedOn = feature.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    task.createdBy = task.lastUpdatedBy = feature.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    let countRef = this.db.object(`${Task.SEQUENCE_COLLECTION_NAME}/${project.key}/${feature.taskPrefix}/count`).query.ref;
    return observableFrom(
      countRef.transaction(count => count ? ++count : 1)
        .then((result: TransactionResult) => {
          task.identifier = `${feature.taskPrefix}-${result.snapshot.val()}`;
          return this.db.list(Task.COLLECTION_NAME).push(task);
        })
        .then(addedTaskRef => {
          task.key = addedTaskRef.key;
          let tasks: Array<TaskSummary> = feature.tasks ? [...feature.tasks, task2TaskSummary(task)] : [task2TaskSummary(task)];
          this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}/features/${featureIndex}`)
            .update({ tasks: tasks });
        })
    );
  }

  protected updateTaskInBackend(project: ProjectRef, taskKey: string, updatedTask: TaskUpdate, epicIndex: number, featureIndex: number,
    taskIndex: number, user: User): Observable<any> {
    updatedTask = {
      ...updatedTask,
      lastUpdatedOn: database.ServerValue.TIMESTAMP,
      lastUpdatedBy: user,
    };
    if (epicIndex != 0 && !epicIndex) {
      return this.updateProjectTask(project, taskKey, updatedTask, taskIndex, user);
    } else {
      if (!project.epics || epicIndex >= project.epics.length) {
        throw { message: "Epic index out of bounds. Can't update task." };
      }
      if (featureIndex != 0 && !featureIndex) {
        return this.updateEpicTask(project, taskKey, updatedTask, epicIndex, taskIndex, user);
      } else {
        if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
          throw { message: "Feature index out of bounds. Can't update task." };
        }
        return this.updateFeatureTask(project, taskKey, updatedTask, epicIndex, featureIndex, taskIndex, user);
      }
    }
  }

  private updateFeatureTask(project: ProjectRef, taskKey: string, updatedTask: TaskUpdate, epicIndex: number, featureIndex: number,
    taskIndex: number, user: User): Observable<any> {
    if (!project.epics[epicIndex].features[featureIndex].tasks || taskIndex >= project.epics[epicIndex].features[featureIndex].tasks.length) {
      throw { message: "Task index out of bounds. Can't update task." };
    }
    const tasks = this.db.list(Task.COLLECTION_NAME);
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return observableFrom(tasks.update(taskKey, { ...updatedTask })).pipe(
      merge(this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}/features/${featureIndex}/tasks/${taskIndex}`)
        .update({ ...taskSummaryUpdatesFromTaskUpdate(updatedTask) }))
    );
  }

  private updateEpicTask(project: ProjectRef, taskKey: string, updatedTask: TaskUpdate, epicIndex: number, taskIndex: number, user: User): Observable<any> {
    if (!project.epics[epicIndex].tasks || taskIndex >= project.epics[epicIndex].tasks.length) {
      throw { message: "Task index out of bounds. Can't update task." };
    }
    const tasks = this.db.list(Task.COLLECTION_NAME);
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return observableFrom(tasks.update(taskKey, { ...updatedTask })).pipe(
      merge(this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/epics/${epicIndex}/tasks/${taskIndex}`)
        .update({ ...taskSummaryUpdatesFromTaskUpdate(updatedTask) }))
    );
  }

  private updateProjectTask(project: ProjectRef, taskKey: string, updatedTask: TaskUpdate, taskIndex: number, user: User): Observable<any> {
    if (!project.tasks || taskIndex >= project.tasks.length) {
      throw { message: "Task index out of bounds. Can't update task." };
    }
    const tasks = this.db.list(Task.COLLECTION_NAME);
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return observableFrom(tasks.update(taskKey, { ...updatedTask })).pipe(
      merge(this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/tasks/${taskIndex}`)
        .update({ ...taskSummaryUpdatesFromTaskUpdate(updatedTask) }))
    );
  }

  protected deleteTaskInBackend(project: ProjectRef, taskKey: string, user: User): Observable<any> {
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return this.db.object(`${Task.COLLECTION_NAME}/${taskKey}`).snapshotChanges().pipe(
      take(1),
      map(action => ({ ...action.payload.val(), key: action.payload.key } as Task)),
      mergeMap(task => {
        let updates = {
          status: TaskStatus.DELETED,
          lastUpdatedOn: database.ServerValue.TIMESTAMP,
          lastUpdatedBy: user
        };
        let epicIndex: number, featureIndex: number, taskIndex: number;
        let tasks: Array<TaskSummary>;
        epicIndex = task.parent.epicIndex;
        if (epicIndex === 0 || epicIndex) {
          if (!project.epics || epicIndex >= project.epics.length) {
            throw { message: "Epic index out of bounds. Can't update task." };
          }
          featureIndex = task.parent.featureIndex;
          if (featureIndex === 0 || featureIndex) {
            if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
              throw { message: "Feature index out of bounds. Can't update task." };
            }
            return this.deleteFeatureTask(project.key, project.epics[epicIndex].features[featureIndex].tasks,
              taskKey, updates, epicIndex, featureIndex, user);
          } else {
            return this.deleteEpicTask(project.key, project.epics[epicIndex].tasks, taskKey, updates, epicIndex, user);
          }
        } else {
          return this.deleteProjectTask(project.key, project.tasks, taskKey, updates, user);
        }
      })
    );
  }

  private deleteFeatureTask(projectKey: string, tasks: Array<TaskSummary>, taskKey: string, updates: any, epicIndex: number, featureIndex: number, user: User): Observable<any> {
    let taskIndex = this.getTaskIndex(tasks, taskKey);
    return observableFrom(this.db.list(Task.COLLECTION_NAME).update(taskKey, updates))
      .pipe(
        merge(this.db.object(`${ProjectRef.COLLECTION_NAME}/${projectKey}/epics/${epicIndex}/features/${featureIndex}/tasks/${taskIndex}`).update(updates))
      );
  }

  private deleteEpicTask(projectKey: string, tasks: Array<TaskSummary>, taskKey: string, updates: any, epicIndex: number, user: User): Observable<any> {
    let taskIndex = this.getTaskIndex(tasks, taskKey);
    return observableFrom(this.db.list(Task.COLLECTION_NAME).update(taskKey, updates))
      .pipe(
        merge(this.db.object(`${ProjectRef.COLLECTION_NAME}/${projectKey}/epics/${epicIndex}/tasks/${taskIndex}`).update(updates))
      );
  }

  private deleteProjectTask(projectKey: string, tasks: Array<TaskSummary>, taskKey: string, updates: any, user: User): Observable<any> {
    let taskIndex = this.getTaskIndex(tasks, taskKey);

    return observableFrom(this.db.list(Task.COLLECTION_NAME).update(taskKey, updates))
      .pipe(
        merge(this.db.object(`${ProjectRef.COLLECTION_NAME}/${projectKey}/tasks/${taskIndex}`).update(updates))
      );
  }

  private getTaskIndex(tasks: Array<TaskSummary>, taskKey: string): number {
    let taskIndex: number;
    if (!tasks) {
      throw { message: "Task index out of bounds. Can't update task." };
    } else {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].key == taskKey) {
          taskIndex = i;
          break;
        }
      }
    }

    if (taskIndex === undefined) {
      throw { message: "Task not found." };
    }

    return taskIndex;
  }

  protected addSprintInBackend(project: ProjectRef, sprint: Sprint, user: User): Observable<any> {
    if (!project.sprints) {
      project.sprints = new Array<Sprint>();
    }
    sprint.createdOn = sprint.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    sprint.createdBy = sprint.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    let sprints = project.sprints ? [...project.sprints, sprint] : [sprint];
    return observableFrom(projects.update(project.key, { lastUpdatedOn: database.ServerValue.TIMESTAMP, lastUpdatedBy: user, sprints: sprints }));
  }

  public updateSprintInBackend(project: ProjectRef, sprintIndex: number, updates: SprintUpdate, user: User): Observable<any> {
    if (!project.sprints || sprintIndex >= project.sprints.length) {
      throw { message: "Sprint index out of bounds. Can't update sprint." };
    }
    updates = {
      ...updates,
      lastUpdatedOn: database.ServerValue.TIMESTAMP,
      lastUpdatedBy: user,
    };
    return observableFrom(this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/sprints/${sprintIndex}`).update({ ...updates }));
  }

  protected addTaskToSprintInBackend(project: ProjectRef, taskKey: string, sprintIndex: number, user: User): Observable<any> {
    if (!project.sprints || sprintIndex >= project.sprints.length) {
      throw { message: "Sprint index out of bounds. Can't add task to sprint." };
    }
    let sprint = project.sprints[sprintIndex];
    let updates = {
      taskKeys: sprint.taskKeys ? [...sprint.taskKeys, taskKey] : [taskKey],
      lastUpdatedOn: database.ServerValue.TIMESTAMP,
      lastUpdatedBy: user,
    };
    return observableFrom(this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/sprints/${sprintIndex}`).update({ ...updates }));
  }

  protected removeTaskFromSprintInBackend(project: ProjectRef, taskKey: string, sprintIndex: number, user: User): Observable<any> {
    if (!project.sprints || sprintIndex >= project.sprints.length) {
      throw { message: "Sprint index out of bounds. Can't remove task from sprint." };
    }
    let sprint = project.sprints[sprintIndex];
    if (!sprint.taskKeys || sprint.taskKeys.length === 0) {
      throw { message: "Sprint contains no tasks. Can't remove task from sprint." };
    }
    for (var i = sprint.taskKeys.length - 1; i >= 0; i--) {
      if (sprint.taskKeys[i] === taskKey) {
        sprint.taskKeys.splice(i, 1);
      }
    }
    let updates = {
      taskKeys: [...sprint.taskKeys],
      lastUpdatedOn: database.ServerValue.TIMESTAMP,
      lastUpdatedBy: user,
    };
    return observableFrom(this.db.object(`${ProjectRef.COLLECTION_NAME}/${project.key}/sprints/${sprintIndex}`).update({ ...updates }));
  }
}
