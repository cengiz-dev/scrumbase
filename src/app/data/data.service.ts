import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/take';

import { Observable } from 'rxjs/Observable';

import { Project } from '../model/project';
import { config } from './data.config';

class LocalData<T> {
    constructor(public updated: number, public data: T) { }

    static fromString(str: string) {
        let localData = JSON.parse(str);
        return new this(localData.updated, localData.data);
    }

    isStale() {
        return new Date().getTime() - this.updated > config.localStorage.lifetime;
    }
}

export abstract class DataService {
    lastRefresh: number;
    @Inject(PLATFORM_ID) private platformId: Object;

    public getProjects(refresh?: boolean): Observable<any> {
        let projects$: Observable<Project[]>;

        if (isPlatformBrowser(this.platformId) && !(refresh && this.allowRefresh())) {
            let projectsString: string = localStorage.getItem(Project.COLLECTION_NAME);
            if (projectsString) {
                let localData = LocalData.fromString(projectsString);
                if (!localData.isStale()) {
                    projects$ = Observable.from([localData.data]);
                }
            }
        }

        if (!projects$) {
            projects$ = this.getProjectsFromBackend();
            if (isPlatformBrowser(this.platformId)) {
                projects$.take(1).subscribe((backendData: Project[]) => {
                    let localData = new LocalData<Project[]>(new Date().getTime(), backendData);
                    localStorage.setItem(Project.COLLECTION_NAME, JSON.stringify(localData));
                });
            }
        }
        return projects$;
    }

    private allowRefresh() {
        let now = Date.now();
        let allow = !this.lastRefresh || now - this.lastRefresh > config.backend.minRefreshFrequency;
        if (allow) {
            this.lastRefresh = now;
        }
        return allow;
    }

    protected abstract getProjectsFromBackend(): Observable<any>;
}
