import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { DataService } from '../data/data.service';
import { GetProjects, CreateProject, ProjectsActionType } from './app.actions';
import { State } from './app.reducers';

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
      this.dataService.addProject(action.payload);
      return Observable.of(new GetProjects());
    });

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private store: Store<State>) { }
}
