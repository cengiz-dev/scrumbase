import { Action } from '@ngrx/store';

import { Project, ProjectRef } from '../model/project.model';
import { Epic } from '../model/epic.model';
import { Feature } from '../model/feature.model';

export enum ProjectsActionType {
  SET_PROJECTS = 'SET_PROJECTS',
  GET_PROJECTS = 'GET_PROJECTS',
  CREATE_PROJECT = 'CREATE_PROJECT',
  EDIT_PROJECT = 'EDIT_PROJECT',
  SAVE_PROJECT = 'SAVE_PROJECT',
  CANCEL_EDIT = 'CANCEL_EDIT',
  ADD_EPIC = 'ADD_EPIC',
  ADD_FEATURE = 'ADD_FEATURE',
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

export class EditProject implements Action {
  readonly type = ProjectsActionType.EDIT_PROJECT;

  constructor(public payload: ProjectRef) {}
}

export class SaveProject implements Action {
  readonly type = ProjectsActionType.SAVE_PROJECT;

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

export class AddFeature implements Action {
  readonly type = ProjectsActionType.ADD_FEATURE;

  constructor(public payload: { project: ProjectRef, epicIndex: number, feature: Feature }) {}
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
  EditProject |
  SaveProject |
  CancelEdit |
  AddEpic |
  AddFeature |
  BackendError |
  DialogClosed |
  RouterNavigation;
