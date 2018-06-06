import { Action } from '@ngrx/store';

import { Project, ProjectRef, ProjectUpdate } from '../model/project.model';
import { Epic, EpicUpdate } from '../model/epic.model';
import { Feature, FeatureUpdate } from '../model/feature.model';
import { Task, TaskUpdate } from '../model/task.model';
import { Sprint, SprintUpdate } from '../model/sprint.model';

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
  SET_TASKS = 'SET_TASKS',
  GET_TASKS = 'GET_TASKS',
  ADD_TASK = 'ADD_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  CREATE_SPRINT = 'CREATE_SPRINT',
  UPDATE_SPRINT = 'UPDATE_SPRINT',
  ADD_TASK_TO_SPRINT = 'ADD_TASK_TO_SPRINT',
  REMOVE_TASK_FROM_SPRINT = "REMOVE_TASK_FROM_SPRINT",
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

  constructor(public payload: { key: string, projectUpdate: ProjectUpdate }) {}
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

  constructor(public payload: { project: ProjectRef, updatedEpic: EpicUpdate, epicIndex: number }) {}
}

export class AddFeature implements Action {
  readonly type = ProjectsActionType.ADD_FEATURE;

  constructor(public payload: { project: ProjectRef, epicIndex: number, feature: Feature }) {}
}

export class UpdateFeature implements Action {
  readonly type = ProjectsActionType.UPDATE_FEATURE;

  constructor(public payload: { project: ProjectRef, updatedFeature: FeatureUpdate, epicIndex: number, featureIndex: number }) {}
}

export class SetTask implements Action {
  readonly type = ProjectsActionType.SET_TASK;

  constructor(public payload: Task) {}
}

export class GetTask implements Action {
  readonly type = ProjectsActionType.GET_TASK;

  constructor(public payload: string) {}
}

export class SetTasks implements Action {
  readonly type = ProjectsActionType.SET_TASKS;

  constructor(public payload: Task[]) {}
}

export class GetTasks implements Action {
  readonly type = ProjectsActionType.GET_TASKS;

  constructor(public payload: string[]) {}
}

export class AddTask implements Action {
  readonly type = ProjectsActionType.ADD_TASK;

  constructor(public payload: { project: ProjectRef, task: Task, epicIndex?: number, featureIndex?: number }) {}
}

export class UpdateTask implements Action {
  readonly type = ProjectsActionType.UPDATE_TASK;

  constructor(public payload: { project: ProjectRef, taskKey: string, updatedTask: TaskUpdate, epicIndex: number, featureIndex: number, taskIndex: number }) {}
}

export class DeleteTask implements Action {
  readonly type = ProjectsActionType.DELETE_TASK;

  constructor(public payload: { project: ProjectRef, taskKey: string }) {}
}

export class CreateSprint implements Action {
  readonly type = ProjectsActionType.CREATE_SPRINT;

  constructor(public payload: { project: ProjectRef, sprint: Sprint }) {}
}

export class UpdateSprint implements Action {
  readonly type = ProjectsActionType.UPDATE_SPRINT;

  constructor(public payload: { project: ProjectRef, sprintIndex: number, updates: SprintUpdate }) {}
}

export class AddTaskToSprint implements Action {
  readonly type = ProjectsActionType.ADD_TASK_TO_SPRINT;

  constructor(public payload: { project: ProjectRef, taskKey: string, sprintIndex: number }) {}
}

export class RemoveTaskFromSprint implements Action {
  readonly type = ProjectsActionType.REMOVE_TASK_FROM_SPRINT;

  constructor(public payload: { project: ProjectRef, taskKey: string, sprintIndex: number }) {}
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
  SetTasks |
  GetTasks |
  AddTask |
  UpdateTask |
  DeleteTask |
  CreateSprint |
  UpdateSprint |
  AddTaskToSprint |
  RemoveTaskFromSprint |
  SwitchEditMode |
  BackendError |
  DialogClosed |
  RouterNavigation;
