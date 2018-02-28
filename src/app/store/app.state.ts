import { ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';

import { Project } from '../model/project.model';

export interface RouterStateUrl {
    url: string;
    queryParams: Params;
    params: Params;
}

export interface ProjectsState {
    projects: Project[],
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
        let state: ActivatedRouteSnapshot = routerState.root;
        while (state.firstChild) {
            state = state.firstChild;
            params = { ...params, ...state.params };
        }

        return { url, queryParams, params };
    }
}