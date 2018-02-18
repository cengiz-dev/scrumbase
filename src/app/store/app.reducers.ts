import { ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { routerReducer, RouterReducerState, RouterAction, RouterStateSerializer } from '@ngrx/router-store';

import { Project } from '../model/project';
import { ProjectsActionType, AllProjectsActions } from './app.actions';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface ProjectsState {
  projects: Project[],
  currentProject: Project,
  editMode: boolean,
}

export interface AppState {
  router: RouterReducerState<RouterStateUrl>,
  projects: ProjectsState,
}

export const reducers: ActionReducerMap<AppState, AllProjectsActions | RouterAction<any, RouterStateUrl>> = {
  router: routerReducer,
  projects: projectsReducer
};

const initialState: ProjectsState = {
  projects: [],
  currentProject: undefined,
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

export const getRouterState =
  createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;
    let state: ActivatedRouteSnapshot = routerState.root;
    while(state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return { url, queryParams, params};
  }
}
