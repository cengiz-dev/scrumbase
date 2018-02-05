import { Action } from '@ngrx/store';

import { Project } from '../model/project';

export enum ProjectsActionType {
  SET_PROJECTS = 'SET_PROJECTS',
  GET_PROJECTS = 'GET_PROJECTS',
  CREATE_PROJECT = 'CREATE_PROJECT',
  SELECT_PROJECT = 'SELECT_PROJECT',
}

export class SetProjects implements Action {
  readonly type = ProjectsActionType.SET_PROJECTS;

  constructor(public payload: Project[]) {}
}

export class GetProjects implements Action {
  readonly type = ProjectsActionType.GET_PROJECTS;

  constructor() {}
}

export class CreateProject implements Action {
  readonly type = ProjectsActionType.CREATE_PROJECT;

  constructor(public payload: Project) {}
}

export class SelectProject implements Action {
  readonly type = ProjectsActionType.SELECT_PROJECT;

  constructor(public payload: number) {}
}

export type AllProjectsActions =
  GetProjects |
  SetProjects |
  CreateProject |
  SelectProject;
