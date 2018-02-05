import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatToolbarModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatExpansionModule,
  MatInputModule,
  MatFormFieldModule,
} from '@angular/material';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { DataModule } from './data/data.module';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { HomeComponent } from './home/home.component';
import { projectsReducer } from './store/app.reducers';
import { ProjectsEffects } from './store/app.effects';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProjectListComponent,
    ProjectDetailsComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ projects: projectsReducer }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([ProjectsEffects]),
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    DataModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
