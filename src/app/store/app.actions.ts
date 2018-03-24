import { Action } from '@ngrx/store';

import { Project, ProjectRef } from '../model/project.model';
import { Epic } from '../model/epic.model';
import { Feature } from '../model/feature.model';
import { Task } from '../model/task.model';

export enum ProjectsActionType {
  SET_PROJECTS = 'SET_PROJECTS',
  GET_PROJECTS = 'GET_PROJECTS',
  CREATE_PROJECT = 'CREATE_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  CANCEL_EDIT = 'CANCEL_EDIT',
  ADD_EPIC = 'ADD_EPIC',
  UPDATE_EPIC = 'UPDATE_EPIC',
  ADD_FEATURE = 'ADD_FEATURE',
  UPDATE_FEATURE = 'UPDATE_FEATURE',
  SET_TASK = 'SET_TASK',
  GET_TASK = 'GET_TASK',
  ADD_TASK = 'ADD_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  SWITCH_EDIT_MODE = 'SWITCH_EDIT_MODE',
  BACKEND_ERROR = 'BACKEND_ERROR',
  DIALOG_CLOSED = 'DIALOG_CLOSED',
  ROUTER_NAVIGATION = 'ROUTER_NAVIGATION',
}

export class SetProjects implements Action {
  readonly type = ProjectsActionType.SET_PROJECTS;

  constructor(public payload: ProjectRef[]) {}
}

export class GetProjects implements Action {
  readonly type = ProjectsActionType.GET_PROJECTS;

  constructor() {}
}

export class CreateProject implements Action {
  readonly type = ProjectsActionType.CREATE_PROJECT;

  constructor(public payload: Project) {}
}

export class UpdateProject implements Action {
  readonly type = ProjectsActionType.UPDATE_PROJECT;

  constructor(public payload: ProjectRef) {}
}

export class CancelEdit implements Action {
  readonly type = ProjectsActionType.CANCEL_EDIT;

  constructor() {}
}

export class AddEpic implements Action {
  readonly type = ProjectsActionType.ADD_EPIC;

  constructor(public payload: { project: ProjectRef, epic: Epic }) {}
}

export class UpdateEpic implements Action {
  readonly type = ProjectsActionType.UPDATE_EPIC;

  constructor(public payload: { project: ProjectRef, updatedEpic: Epic, epicIndex: number }) {}
}

export class AddFeature implements Action {
  readonly type = ProjectsActionType.ADD_FEATURE;

  constructor(public payload: { project: ProjectRef, epicIndex: number, feature: Feature }) {}
}

export class UpdateFeature implements Action {
  readonly type = ProjectsActionType.UPDATE_FEATURE;

  constructor(public payload: { project: ProjectRef, updatedFeature: Feature, epicIndex: number, featureIndex: number }) {}
}

export class SetTask implements Action {
  readonly type = ProjectsActionType.SET_TASK;

  constructor(public payload: Task) {}
}

export class GetTask implements Action {
  readonly type = ProjectsActionType.GET_TASK;

  constructor(public payload: string) {}
}

export class AddTask implements Action {
  readonly type = ProjectsActionType.ADD_TASK;

  constructor(public payload: { project: ProjectRef, epicIndex: number, featureIndex: number, task: Task }) {}
}

export class UpdateTask implements Action {
  readonly type = ProjectsActionType.UPDATE_TASK;

  constructor(public payload: { project: ProjectRef, updatedTask: Task, epicIndex: number, featureIndex: number, taskIndex: number }) {}
}

export class SwitchEditMode implements Action {
  readonly type = ProjectsActionType.SWITCH_EDIT_MODE;

  constructor(public payload: boolean) {}
}

export class BackendError implements Action {
  readonly type = ProjectsActionType.BACKEND_ERROR;

  constructor(public payload: any) {}
}

export class DialogClosed implements Action {
  readonly type = ProjectsActionType.DIALOG_CLOSED;

  constructor() {}
}

export class RouterNavigation implements Action {
  readonly type = ProjectsActionType.ROUTER_NAVIGATION;

  constructor(public payload: any) {}
}

export type AllProjectsActions =
  GetProjects |
  SetProjects |
  CreateProject |
  UpdateProject |
  CancelEdit |
  AddEpic |
  UpdateEpic |
  AddFeature |
  UpdateFeature |
  SetTask |
  GetTask |
  AddTask |
  UpdateTask |
  SwitchEditMode |
  BackendError |
  DialogClosed |
  RouterNavigation;
