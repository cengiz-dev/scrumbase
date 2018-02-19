import { Action } from '@ngrx/store';

import { Project, ProjectRef } from '../model/project.model';

export enum ProjectsActionType {
  SET_PROJECTS = 'SET_PROJECTS',
  GET_PROJECTS = 'GET_PROJECTS',
  CREATE_PROJECT = 'CREATE_PROJECT',
  EDIT_PROJECT = 'EDIT_PROJECT',
  SAVE_PROJECT = 'SAVE_PROJECT',
  CANCEL_EDIT = 'CANCEL_EDIT'
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

export type AllProjectsActions =
  GetProjects |
  SetProjects |
  CreateProject |
  EditProject |
  SaveProject |
  CancelEdit;
