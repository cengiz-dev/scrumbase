import { ActionReducerMap } from '@ngrx/store';
import { routerReducer, RouterAction } from '@ngrx/router-store';

import { Project } from '../model/project';
import { ProjectsActionType, AllProjectsActions } from './app.actions';
import { AppState, ProjectsState, RouterStateUrl } from './app.state';

export const reducers: ActionReducerMap<AppState, AllProjectsActions | RouterAction<any, RouterStateUrl>> = {
  router: routerReducer,
  projects: projectsReducer
};

const initialState: ProjectsState = {
  projects: [],
  editMode: false,
};

export function projectsReducer(state = initialState, action: AllProjectsActions): ProjectsState {
  switch (action.type) {
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
    case ProjectsActionType.EDIT_PROJECT:
      return {
        ...state,
        editMode: true,
      };
    case ProjectsActionType.SAVE_PROJECT:
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
