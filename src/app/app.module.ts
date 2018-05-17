import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { LinkyModule } from 'angular-linky';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppDialogComponent } from './app.dialog';
import { HeaderComponent } from './header/header.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { DataModule } from './data/data.module';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { HomeComponent } from './home/home.component';
import { reducers } from './store/app.reducers';
import { CustomSerializer } from './store/app.state';
import { ProjectsEffects } from './store/app.effects';
import { environment } from '../environments/environment';
import { AuthModule } from './auth/auth.module';
import { EpicDetailsComponent } from './epic-details/epic-details.component';
import { ProjectComponent } from './project/project.component';
import { FeatureDetailsComponent } from './feature-details/feature-details.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { RemoveSpacesPipe } from './shared/remove-spaces.pipe';
import { AppMaterialModule } from './app-material.module';

@NgModule({
  declarations: [
    AppComponent,
    AppDialogComponent,
    HeaderComponent,
    ProjectListComponent,
    ProjectDetailsComponent,
    HomeComponent,
    EpicDetailsComponent,
    ProjectComponent,
    FeatureDetailsComponent,
    TaskDetailsComponent,
    RemoveSpacesPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ProjectsEffects]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router' // name of reducer key
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    }),
    BrowserAnimationsModule,
    FormsModule,
    AppMaterialModule,
    DataModule,
    AuthModule,
    LinkyModule,
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
  bootstrap: [AppComponent],
  entryComponents: [AppDialogComponent],
})
export class AppModule { }
