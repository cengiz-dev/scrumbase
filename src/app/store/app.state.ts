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
}

export interface AppState {
    router: RouterReducerState<RouterStateUrl>,
    projects: ProjectsState,
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
    serialize(routerState: RouterStateSnapshot): RouterStateUrl {
        const { url } = routerState;
        const { queryParams } = routerState.root;
        let state: ActivatedRouteSnapshot = routerState.root;
        while (state.firstChild) {
            state = state.firstChild;
        }
        const { params } = state;

        return { url, queryParams, params };
    }
}