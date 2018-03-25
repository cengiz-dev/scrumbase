import { Params } from "@angular/router";
import { createSelector, createFeatureSelector } from "@ngrx/store";
import { RouterReducerState } from '@ngrx/router-store';

import { RouterStateUrl, ProjectsState } from "./app.state";
import { Project, ProjectRef } from "../model/project.model";
import { Task, TaskSummary } from "../model/task.model";
import { Feature } from "../model/feature.model";
import { Epic } from "../model/epic.model";

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
    (projects: Project[]) => projects.filter((item: Project) => Date.now() - item.lastUpdatedOn < 30 * 24 * 60 * 60 * 1000),
);

export const getSelectedProjectIndex = createSelector(
    getRouterState,
    (routerState: RouterReducerState<RouterStateUrl>): number => {
        let result: number;
        if (routerState) {
            result = routerState.state.params.index;
        }
        return result;
    }
);

export const getCurrentTask = createSelector(
    getProjectsState,
    (state: ProjectsState): Task => state.currentTask,
);

export const getRouteParams = createSelector(
    getRouterState,
    (routerState: RouterReducerState<RouterStateUrl>): Params => routerState.state.params
);

export const getSelectedProject = createSelector(
    getProjects,
    getRouterState,
    (projects: ProjectRef[], routerState: RouterReducerState<RouterStateUrl>): ProjectRef => {
        let result: ProjectRef;
        if (routerState) {
            let index: number = routerState.state.params.index;
            if (index < projects.length) {
                result = projects[index];
            }
        }
        return result;
    }
);

export const getSelectedEpic = createSelector(
    getProjects,
    getRouterState,
    (projects: ProjectRef[], routerState: RouterReducerState<RouterStateUrl>): Epic => {
        let result: Epic;
        if (routerState) {
            let index: number = routerState.state.params.index;
            if (index < projects.length) {
                let project = projects[index];
                let epicIndex: number = routerState.state.params.epicIndex;
                if (project.epics && epicIndex < project.epics.length) {
                    result = project.epics[epicIndex];
                }
            }
        }
        return result;
    }
);

export const getSelectedFeature = createSelector(
    getProjects,
    getRouterState,
    (projects: ProjectRef[], routerState: RouterReducerState<RouterStateUrl>): Feature => {
        let result: Feature;
        if (routerState) {
            let index: number = routerState.state.params.index;
            if (index < projects.length) {
                let project = projects[index];
                let epicIndex: number = routerState.state.params.epicIndex;
                if (project.epics && epicIndex < project.epics.length) {
                    let epic = project.epics[epicIndex];
                    let featureIndex: number = routerState.state.params.featureIndex;
                    if (epic.features && featureIndex < epic.features.length) {
                        result = epic.features[featureIndex];
                    }
                }
            }
        }
        return result;
    }
);

export const getSelectedTaskSummary = createSelector(
    getProjects,
    getRouterState,
    (projects: ProjectRef[], routerState: RouterReducerState<RouterStateUrl>): TaskSummary => {
        let result: TaskSummary;
        if (routerState) {
            let index: number = routerState.state.params.index;
            if (index < projects.length) {
                let project = projects[index];
                let epicIndex: number = routerState.state.params.epicIndex;
                if (project.epics && epicIndex < project.epics.length) {
                    let epic = project.epics[epicIndex];
                    let featureIndex: number = routerState.state.params.featureIndex;
                    if (epic.features && featureIndex < epic.features.length) {
                        let feature = epic.features[featureIndex];
                        let taskIndex: number = routerState.state.params.taskIndex;
                        if (feature.tasks && taskIndex < feature.tasks.length) {
                            result = feature.tasks[taskIndex];
                        }
                    }
                }
            }
        }
        return result;
    }
);

export const getBreadcrumbs = createSelector(
    getRouterState,
    (routerState: RouterReducerState<RouterStateUrl>) => routerState.state.segments,
);