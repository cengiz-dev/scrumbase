import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, pipe } from 'rxjs/Rx';
import { map, switchMap, mergeMap, catchError, combineLatest } from 'rxjs/operators';
import { of } from 'rxjs';


import { DataService } from '../data/data.service';
import {
  GetProjects,
  CreateProject,
  UpdateProject,
  ProjectsActionType,
  AddEpic,
  BackendError,
  AllProjectsActions,
  SetProjects,
  AddFeature,
  AddTask,
  UpdateEpic,
  UpdateFeature,
  UpdateTask,
  GetTask,
  SetTask,
} from './app.actions';
import { AppState } from './app.state';
import { AuthService } from '../auth/auth.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class ProjectsEffects {
  @Effect()
  getProjects$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.GET_PROJECTS).pipe(
    switchMap((action: GetProjects) => this.dataService.getProjects()),
    map(projects => new SetProjects(projects)),);

  @Effect()
  createProject$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.CREATE_PROJECT).pipe(
    switchMap((action: CreateProject) => {
      const user$ = this.authService.getUser();
      const create$ = user$.pipe(
        mergeMap(user => this.dataService.addProject(action.payload, user))
      );
      return create$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err))))
    }));

  @Effect()
  updateProject$: Observable<AllProjectsActions> = this.actions$.pipe(
    ofType(ProjectsActionType.UPDATE_PROJECT),
    mergeMap((action: UpdateProject) => {
      const user$ = this.authService.getUser();
      const dataUpdate$ = user$.pipe(
        mergeMap(user => this.dataService.updateProject(action.payload.key, action.payload.projectUpdate, user))
      );
      return dataUpdate$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err)))
      );
    })
  );

  @Effect()
  addEpic$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.ADD_EPIC).pipe(
    switchMap((action: AddEpic) => {
      const user$ = this.authService.getUser();
      const dataUpdate$ = user$.pipe(
        mergeMap(user => this.dataService.addEpic(action.payload.project, action.payload.epic, user))
      );
      return dataUpdate$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err)))
      );
    }));

  @Effect()
  updateEpic$: Observable<AllProjectsActions> = this.actions$.pipe(
    ofType(ProjectsActionType.UPDATE_EPIC),
    mergeMap((action: UpdateEpic) => {
      const user$ = this.authService.getUser();
      const dataUpdate$ = user$.pipe(
        mergeMap(user => this.dataService.updateEpic(action.payload.project, action.payload.updatedEpic, action.payload.epicIndex, user))
      );
      return dataUpdate$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err)))
      );
    })
  );

  @Effect()
  addFeature$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.ADD_FEATURE).pipe(
    switchMap((action: AddFeature) => {
      const user$ = this.authService.getUser();
      const dataUpdate$ = user$.pipe(
        mergeMap(user => this.dataService.addFeature(action.payload.project, action.payload.epicIndex, action.payload.feature, user))
      );
      return dataUpdate$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err)))
      );
    }));

  @Effect()
  updateFeature$: Observable<AllProjectsActions> = this.actions$.pipe(
    ofType(ProjectsActionType.UPDATE_FEATURE),
    mergeMap((action: UpdateFeature) => {
      const user$ = this.authService.getUser();
      const dataUpdate$ = user$.pipe(
        mergeMap(user => this.dataService.updateFeature(action.payload.project, action.payload.updatedFeature, action.payload.epicIndex,
          action.payload.featureIndex, user))
      );
      return dataUpdate$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err)))
      );
    })
  );

  @Effect()
  getTask$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.GET_TASK).pipe(
    switchMap((action: GetTask) => this.dataService.getTask(action.payload)),
    map(task => new SetTask(task)),);

  @Effect()
  addTask$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.ADD_TASK).pipe(
    switchMap((action: AddTask) => {
      const user$ = this.authService.getUser();
      const dataUpdate$ = user$.pipe(
        mergeMap(user => this.dataService.addTask(action.payload.project, action.payload.epicIndex, action.payload.featureIndex,
          action.payload.task, user))
      );
      return dataUpdate$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err)))
      );
    }));

  @Effect()
  updateTask$: Observable<AllProjectsActions> = this.actions$.pipe(
    ofType(ProjectsActionType.UPDATE_TASK),
    mergeMap((action: UpdateTask) => {
      const user$ = this.authService.getUser();
      const dataUpdate$ = user$.pipe(
        mergeMap(user => this.dataService.updateTask(action.payload.project, action.payload.taskKey, action.payload.updatedTask, action.payload.epicIndex,
          action.payload.featureIndex, action.payload.taskIndex, user))
      );
      return dataUpdate$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err)))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private authService: AuthService,
    private store: Store<AppState>) { }
}
