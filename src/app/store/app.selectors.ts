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