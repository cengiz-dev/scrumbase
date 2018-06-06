import { ActionReducerMap } from '@ngrx/store';
import { routerReducer, RouterAction } from '@ngrx/router-store';

import { Project } from '../model/project.model';
import { ProjectsActionType, AllProjectsActions } from './app.actions';
import { AppState, ProjectsState, RouterStateUrl } from './app.state';

export const reducers: ActionReducerMap<AppState, AllProjectsActions | RouterAction<any, RouterStateUrl>> = {
  router: routerReducer,
  projects: projectsReducer
};

const initialState: ProjectsState = {
  projects: [],
  editMode: false,
  currentTask: undefined,
  currentTasks: undefined,
  backendError: undefined,
};

export function projectsReducer(state = initialState, action: AllProjectsActions): ProjectsState {
  switch (action.type) {
    case ProjectsActionType.BACKEND_ERROR:
      return {
        ...state,
        backendError: action.payload,
      };
    case ProjectsActionType.DIALOG_CLOSED:
      return {
        ...state,
        backendError: undefined,
      };
    case ProjectsActionType.SET_PROJECTS:
      return {
        ...state,
        projects: [...action.payload],
      };
    case ProjectsActionType.CREATE_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case ProjectsActionType.SWITCH_EDIT_MODE:
      return {
        ...state,
        editMode: action.payload,
      };
    case ProjectsActionType.SET_TASK:
      return {
        ...state,
        currentTask: action.payload,
      };
    case ProjectsActionType.GET_TASK:
      return {
        ...state,
        currentTask: undefined,
      };
    case ProjectsActionType.SET_TASKS:
      return {
        ...state,
        currentTasks: action.payload,
      };
    case ProjectsActionType.GET_TASKS:
      return {
        ...state,
        currentTasks: undefined,
      };
    case ProjectsActionType.UPDATE_PROJECT:
    case ProjectsActionType.UPDATE_EPIC:
    case ProjectsActionType.UPDATE_FEATURE:
    case ProjectsActionType.UPDATE_TASK:
    case ProjectsActionType.UPDATE_SPRINT:
      return {
        ...state,
        editMode: false,
      };
    case ProjectsActionType.CANCEL_EDIT:
      return {
        ...state,
        editMode: false,
      };
    default:
      return state;
  }
}
