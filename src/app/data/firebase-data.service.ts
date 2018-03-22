import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';
import { Observable } from 'rxjs/Observable';

import { Project, ProjectRef } from '../model/project.model';
import { DataService } from './data.service';
import { User } from '../model/user.model';
import { Epic } from '../model/epic.model';
import './observable.from-thenable';
import { Feature } from '../model/feature.model';
import { Task } from '../model/task.model';

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
          data.id = a.payload.key;
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
    return projects.update(project.id, { ...project });
  }

  addEpicInBackend(project: ProjectRef, epic: Epic, user: User): Promise<void> {
    if (!project.epics) {
      project.epics = new Array<Epic>();
    }
    epic.createdOn = epic.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    epic.createdBy = epic.lastUpdatedBy = user;
    project.epics.push(epic);
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.id, { lastUpdatedOn: database.ServerValue.TIMESTAMP, lastUpdatedBy: user, epics: project.epics });
  }

  updateEpicInBackend(project: ProjectRef, updatedEpic: Epic, epicIndex: number, user: User): Promise<void> {
    let epic: Epic;
    if (project.epics && epicIndex < project.epics.length) {
      epic = project.epics[epicIndex] = {
        ...updatedEpic
      };
    } else {
      throw "Epic index out of bounds. Can't update epic.";
    }
    epic.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    epic.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.id, { epics: project.epics });
  }

  addFeatureInBackend(project: ProjectRef, epicIndex: number, feature: Feature, user: User): Promise<void> {
    let epic: Epic;
    if (project.epics && epicIndex < project.epics.length) {
      epic = project.epics[epicIndex];
    } else {
      throw "Epic index out of bounds. Can't add feature.";
    }
    if (!epic.features) {
      epic.features = new Array<Feature>();
    }
    feature.createdOn = feature.lastUpdatedOn = epic.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    feature.createdBy = feature.lastUpdatedBy = epic.lastUpdatedBy = user;
    epic.features.push(feature);
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.id, { epics: project.epics });
  }

  updateFeatureInBackend(project: ProjectRef, updatedFeature: Feature, epicIndex: number, featureIndex: number, user: User): Promise<void> {
    let feature: Feature;
    if (!project.epics || epicIndex >= project.epics.length) {
      throw "Epic index out of bounds. Can't update feature.";
    } else if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
      throw "Feature index out of bounds. Can't update feature.";
    } else {
      feature = project.epics[epicIndex].features[featureIndex] = {
        ...updatedFeature
      };
    }
    feature.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    feature.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.id, { epics: project.epics });
  }

  addTaskInBackend(project: ProjectRef, epicIndex: number, featureIndex: number, task: Task, user: User): Promise<void> {
    let feature: Feature;
    if (!project.epics || epicIndex >= project.epics.length) {
      throw "Epic index out of bounds. Can't add task.";
    } else if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
      throw "Feature index out of bounds. Can't add task.";
    } else {
      feature = project.epics[epicIndex].features[featureIndex];
    }
    if (!feature.tasks) {
      feature.tasks = new Array<Task>();
    }
    task.createdOn = task.lastUpdatedOn = feature.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    task.createdBy = task.lastUpdatedBy = feature.lastUpdatedBy = user;
    feature.tasks.push(task);
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.id, { epics: project.epics });
  }

  updateTaskInBackend(project: ProjectRef, updatedTask: Task, epicIndex: number, featureIndex: number,
      taskIndex: number, user: User): Promise<void> {
    let task: Task;
    if (!project.epics || epicIndex >= project.epics.length) {
      throw "Epic index out of bounds. Can't update task.";
    } else if (!project.epics[epicIndex].features || featureIndex >= project.epics[epicIndex].features.length) {
      throw "Feature index out of bounds. Can't update task.";
    } else if (!project.epics[epicIndex].features[featureIndex].tasks || taskIndex >= project.epics[epicIndex].features[featureIndex].tasks.length) {
      throw "Task index out of bounds. Can't update task.";
    } else {
      task = project.epics[epicIndex].features[featureIndex].tasks[taskIndex] = {
        ...updatedTask
      };
    }
    task.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    task.lastUpdatedBy = user;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.id, { epics: project.epics });
  }
}
