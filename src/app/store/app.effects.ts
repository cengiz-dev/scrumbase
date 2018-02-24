import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, pipe } from 'rxjs/Rx';
import { map, switchMap, mergeMap, catchError, combineLatest } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/do';

import { DataService } from '../data/data.service';
import { GetProjects, CreateProject, SaveProject, ProjectsActionType, AddEpic, BackendError } from './app.actions';
import { AppState } from './app.state';
import { AuthService } from '../auth/auth.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class ProjectsEffects {
  @Effect()
  getProjects$ = this.actions$
    .ofType(ProjectsActionType.GET_PROJECTS)
    .switchMap((action: GetProjects) => this.dataService.getProjects())
    .map(projects => ({ type: ProjectsActionType.SET_PROJECTS, payload: projects }));

  @Effect()
  createProject$ = this.actions$
    .ofType(ProjectsActionType.CREATE_PROJECT)
    .switchMap((action: CreateProject) => {
      const user$ = this.authService.getUser();
      const create$ = user$.pipe(
        mergeMap(user => this.dataService.addProject(action.payload, user))
      );
      return create$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err))))
    });

  @Effect()
  updateProject$ = this.actions$.pipe(
    ofType(ProjectsActionType.SAVE_PROJECT),
    mergeMap((action: SaveProject) => {
      const user$ = this.authService.getUser();
      const dataUpdate$ = user$.pipe(
        mergeMap(user => this.dataService.updateProject(action.payload, user))
      );
      return dataUpdate$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err)))
      );
    })
  );

  @Effect()
  addEpic$ = this.actions$
    .ofType(ProjectsActionType.ADD_EPIC)
    .switchMap((action: AddEpic) => {
      const user$ = this.authService.getUser();
      const dataUpdate$ = user$.pipe(
        mergeMap(user => this.dataService.addEpic(action.payload.project, action.payload.epic, user))
      );
      return dataUpdate$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err)))
      );
    });

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private authService: AuthService,
    private store: Store<AppState>) { }
}
