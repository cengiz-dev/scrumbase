import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { database } from 'firebase';
import { Observable } from 'rxjs/Observable';

import { Project, ProjectRef } from '../model/project.model';
import { DataService } from './data.service';

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

  addProjectToBackend(project: Project) {
    project.createdOn = database.ServerValue.TIMESTAMP;
    project.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    this.db.list(ProjectRef.COLLECTION_NAME).push(project);
  }

  updateProjectInBackend(project: ProjectRef) {
    project.lastUpdatedOn = database.ServerValue.TIMESTAMP;
    const projects = this.db.list(ProjectRef.COLLECTION_NAME);
    projects.update(project.id, { ...project });
  }
}
