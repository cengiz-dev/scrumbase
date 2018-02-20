import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { DataService } from '../data/data.service';
import { GetProjects, CreateProject, SaveProject, ProjectsActionType } from './app.actions';
import { AppState } from './app.state';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProjectsEffects {
  @Effect()
  getProjects = this.actions$
    .ofType(ProjectsActionType.GET_PROJECTS)
    .switchMap((action: GetProjects) => this.dataService.getProjects())
    .map(projects => ({ type: ProjectsActionType.SET_PROJECTS, payload: projects }));

  @Effect()
  createProject = this.actions$
    .ofType(ProjectsActionType.CREATE_PROJECT)
    .switchMap((action: CreateProject) => {
      this.authService.getUser().subscribe(user => this.dataService.addProject(action.payload, user));
      return Observable.of(new GetProjects());
    });

  @Effect()
  updateProject = this.actions$
    .ofType(ProjectsActionType.SAVE_PROJECT)
    .switchMap((action: SaveProject) => {
      this.authService.getUser().subscribe(user => this.dataService.updateProject(action.payload, user));
      return Observable.of(new GetProjects());
    });

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private authService: AuthService,
    private store: Store<AppState>) { }
}
