import { ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';

import { Project } from '../model/project.model';
import { Task, TaskSummary } from '../model/task.model';

export interface AppUrlSegment {
    name: string;
    index: string;
}

export interface RouterStateUrl {
    url: string;
    queryParams: Params;
    params: Params;
    segments: AppUrlSegment[];
}

export interface ProjectsState {
    projects: Project[],
    editMode: boolean,
    currentTask: Task,
    currentTasks: TaskSummary[],
    backendError: { code: string, message: string },
}

export interface AppState {
    router: RouterReducerState<RouterStateUrl>,
    projects: ProjectsState,
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
        const { url } = routerState;
        const { queryParams } = routerState.root;
        let params: any;
        let segments = new Array<AppUrlSegment>();
        let state: ActivatedRouteSnapshot = routerState.root;
        while (state.firstChild) {
            state = state.firstChild;
            params = { ...params, ...state.params };
            for (let i = 0; i+1 < state.url.length; i += 2) {
                segments.push({ name: state.url[i].path, index: state.url[i+1].path });
            }
        }

        return { url, queryParams, params, segments };
    }
}