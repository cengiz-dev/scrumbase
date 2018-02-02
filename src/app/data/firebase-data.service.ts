import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Project } from '../model/project';
import { DataService } from './data.service';

@Injectable()
export class FirebaseDataService extends DataService {
  constructor(private db: AngularFireDatabase) {
    super();
  }

  getProjectsFromBackend(): Observable<any> {
    return this.db.list(Project.COLLECTION_NAME).valueChanges();
  }
}
