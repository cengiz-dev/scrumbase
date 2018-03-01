import { ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';

import { Project } from '../model/project.model';

export interface RouterStateUrl {
    url: string;
    queryParams: Params;
    params: Params;
    segments: string[];
}

export interface ProjectsState {
    projects: Project[],
    breadcrumbs: string[],
    editMode: boolean,
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
        let segments = new Array<string>();
        let state: ActivatedRouteSnapshot = routerState.root;
        while (state.firstChild) {
            state = state.firstChild;
            params = { ...params, ...state.params };
            if (state.url.length > 0) {
                segments.push(state.url[0].path);
            }
        }

        return { url, queryParams, params, segments };
    }
}