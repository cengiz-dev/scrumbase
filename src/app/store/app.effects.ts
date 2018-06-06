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
  DeleteTask,
  CreateSprint,
  AddTaskToSprint,
  GetTasks,
  SetTasks,
  UpdateSprint,
  RemoveTaskFromSprint,
} from './app.actions';
import { AppState } from './app.state';
import { AuthService } from '../auth/auth.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Project } from '../model/project.model';
import { Sprint } from '../model/sprint.model';

@Injectable()
export class ProjectsEffects {
  @Effect()
  getProjects$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.GET_PROJECTS).pipe(
      switchMap((action: GetProjects) => this.dataService.getProjects()),
      map(projects => new SetProjects(projects))
    );

  @Effect()
  createProject$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.CREATE_PROJECT).pipe(
      switchMap((action: CreateProject) => this.authService.getUser().pipe(
        mergeMap(user => this.dataService.addProject(action.payload as Project, user)),
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err))))
      )
    );

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
      map(task => new SetTask(task)));

  @Effect()
  getTasks$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.GET_TASKS).pipe(
      switchMap((action: GetTasks) => this.dataService.getTasks(action.payload)),
      map(tasks => new SetTasks(tasks)));

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

  @Effect()
  deleteTask$: Observable<AllProjectsActions> = this.actions$.pipe(
    ofType(ProjectsActionType.DELETE_TASK),
    mergeMap((action: DeleteTask) => {
      const user$ = this.authService.getUser();
      const dataUpdate$ = user$.pipe(
        mergeMap(user => this.dataService.deleteTask(action.payload.project, action.payload.taskKey, user))
      );
      return dataUpdate$.pipe(
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err)))
      );
    })
  );

  @Effect()
  createSprint$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.CREATE_SPRINT).pipe(
      switchMap((action: CreateSprint) => this.authService.getUser().pipe(
        mergeMap(user => this.dataService.addSprint(action.payload.project, action.payload.sprint, user)),
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err))))
      )
    );

  @Effect()
  updateSprint$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.UPDATE_SPRINT).pipe(
      switchMap((action: UpdateSprint) => this.authService.getUser().pipe(
        mergeMap(user => this.dataService.updateSprint(action.payload.project, action.payload.sprintIndex, action.payload.updates, user)),
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err))))
      )
    );

  @Effect()
  addTaskToSprint$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.ADD_TASK_TO_SPRINT).pipe(
      switchMap((action: AddTaskToSprint) => this.authService.getUser().pipe(
        mergeMap(user => this.dataService.addTaskToSprint(action.payload.project, action.payload.taskKey, action.payload.sprintIndex, user)),
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err))))
      )
    );

  @Effect()
  removeTaskFromSprint$: Observable<AllProjectsActions> = this.actions$
    .ofType(ProjectsActionType.REMOVE_TASK_FROM_SPRINT).pipe(
      switchMap((action: RemoveTaskFromSprint) => this.authService.getUser().pipe(
        mergeMap(user => this.dataService.removeTaskFromSprint(action.payload.project, action.payload.taskKey, action.payload.sprintIndex, user)),
        map(() => new GetProjects()),
        catchError(err => of(new BackendError(err))))
      )
    );

  constructor(
    private actions$: Actions,
    private dataService: DataService,
    private authService: AuthService,
    private store: Store<AppState>) { }
}
