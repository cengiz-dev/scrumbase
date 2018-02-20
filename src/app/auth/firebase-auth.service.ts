import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

import { Project, ProjectRef } from '../model/project.model';
import { AuthService } from './auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../model/user.model';

@Injectable()
export class FirebaseAuthService extends AuthService {
    constructor(private firebaseAuth: AngularFireAuth) {
        super();
    }

    login() {
        this.firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    logout() {
        this.firebaseAuth.auth.signOut();
    }

    getUser(): Observable<User | null> {
        return this.firebaseAuth.authState.map(user => user ? new User(user.uid, user.providerId, user.displayName) : null);
    }
}
