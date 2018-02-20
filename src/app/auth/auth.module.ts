import { NgModule } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { FirebaseAuthService } from './firebase-auth.service';

@NgModule({
  imports: [
      AngularFireAuthModule
  ],
  exports: [
      AngularFireAuthModule
  ],
  providers: [
    { provide: AuthService, useClass: FirebaseAuthService }
  ]
})
export class AuthModule { }