import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, pipe } from 'rxjs/Rx';
import { map, switchMap, mergeMap, catchError, combineLatest } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/do';

import { DataService } from '../data/data.service';
import { GetProjects, CreateProject, SaveProject, ProjectsActionType, AddEpic, BackendError, AllProjectsActions, SetProjects, BreadcrumbChanged } from './app.actions';
import { AppState } from './app.state';
import { AuthService } from '../auth/auth.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class ProjectsEffects {
  @Effect()
  getProjects$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.GET_PROJECTS)
    .switchMap((action: GetProjects) => this.dataService.getProjects())
    .map(projects => new SetProjects(projects));

  @Effect()
  createProject$: Observable<AllProjectsActions> = this.actions$
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
  updateProject$: Observable<AllProjectsActions> = this.actions$.pipe(
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
  addEpic$: Observable<AllProjectsActions> = this.actions$
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

  @Effect()
  locationUpdate$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.ROUTER_NAVIGATION)
    .filter((action: any) => {
      const segments = action.payload.routerState.segments;
      return segments.length > 0 && segments[0] == 'project';
    })
    .switchMap((action: any) => Observable.of(new BreadcrumbChanged(action.payload.routerState.segments)));

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private authService: AuthService,
    private store: Store<AppState>) { }
}
