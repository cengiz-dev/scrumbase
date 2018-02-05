import { ActionReducerMap } from '@ngrx/store';

import { Project } from '../model/project';
import { ProjectsActionType, AllProjectsActions } from './app.actions';

export interface State {
  projects: Project[],
}

export const reducers: ActionReducerMap<State, AllProjectsActions> = {
  projects: projectsReducer
};

const initialState: Project[] = [];

export function projectsReducer(state = initialState, action: AllProjectsActions): Project[] {
  switch (action.type) {
    case ProjectsActionType.SET_PROJECTS:
      return [...action.payload];
    case ProjectsActionType.CREATE_PROJECT:
      return [...state, action.payload];
    default:
      return state;
  }
}
