import { Action } from '@ngrx/store';

import { Project, ProjectRef } from '../model/project.model';
import { Epic } from '../model/epic.model';

export enum ProjectsActionType {
  SET_PROJECTS = 'SET_PROJECTS',
  GET_PROJECTS = 'GET_PROJECTS',
  CREATE_PROJECT = 'CREATE_PROJECT',
  EDIT_PROJECT = 'EDIT_PROJECT',
  SAVE_PROJECT = 'SAVE_PROJECT',
  CANCEL_EDIT = 'CANCEL_EDIT',
  ADD_EPIC = 'ADD_EPIC',
  BACKEND_ERROR = 'BACKEND_ERROR',
  DIALOG_CLOSED = 'DIALOG_CLOSED',
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

export class BackendError implements Action {
  readonly type = ProjectsActionType.BACKEND_ERROR;

  constructor(public payload: any) {}
}

export class DialogClosed implements Action {
  readonly type = ProjectsActionType.DIALOG_CLOSED;

  constructor() {}
}

export type AllProjectsActions =
  GetProjects |
  SetProjects |
  CreateProject |
  EditProject |
  SaveProject |
  CancelEdit |
  AddEpic |
  BackendError |
  DialogClosed;
