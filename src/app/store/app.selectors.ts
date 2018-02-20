import { createSelector, createFeatureSelector } from "@ngrx/store";
import { RouterReducerState } from '@ngrx/router-store';

import { RouterStateUrl, ProjectsState } from "./app.state";
import { Project } from "../model/project.model";

export const getRouterState =
    createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const getProjectsState =
    createFeatureSelector<ProjectsState>('projects');

export const getProjects = createSelector(
    getProjectsState,
    (state: ProjectsState) => state.projects,
);

// Filter out project created or updated more than 30 days ago.
export const getRecentProjects = createSelector(
    getProjects,
    (projects: Project[]) => projects.filter( (item: Project) => Date.now() - item.lastUpdatedOn < 30*24*60*60*1000),
);

export const getSelectedProject = createSelector(
    getProjects,
    getRouterState,
    (projects: Project[], routerState: RouterReducerState<RouterStateUrl>): Project => {
        let result: Project;
        if (routerState) {
            let index: number = routerState.state.params.index;
            if (index < projects.length) result = projects[index];
        }
        return result;
    }
);