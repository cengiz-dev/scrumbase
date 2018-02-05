import { ActionReducerMap } from '@ngrx/store';

import { Project } from '../model/project';
import { ProjectsActionType, AllProjectsActions } from './app.actions';

export interface ProjectsState {
  projects: Project[],
  currentProjectIndex: number,
}

export interface AppState {
  projects: ProjectsState,
}

export const reducers: ActionReducerMap<AppState, AllProjectsActions> = {
  projects: projectsReducer
};

const initialState: ProjectsState = {
  projects: [],
  currentProjectIndex: undefined,
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
    case ProjectsActionType.SELECT_PROJECT:
      return {
        ...state,
        currentProjectIndex: action.payload,
      };
    default:
      return state;
  }
}
