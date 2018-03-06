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
    project.epics.push(epic);
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.id, { lastUpdatedOn: database.ServerValue.TIMESTAMP, lastUpdatedBy: user, epics: project.epics });
  }

  addFeatureInBackend(project: ProjectRef, epicIndex: number, feature: Feature, user: User): Promise<void> {
    let epic: Epic;
    if (project.epics && epicIndex < project.epics.length) {
      epic = project.epics[epicIndex];
    } else {
      throw "Epic index out of bounds. Can't add feature."
    }
    epic.features.push(feature);
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    return projects.update(project.id, { lastUpdatedOn: database.ServerValue.TIMESTAMP, lastUpdatedBy: user, epics: project.epics });
  }
}
