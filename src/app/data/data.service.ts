import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/take';

import { Project, ProjectRef } from '../model/project.model';
import { config } from './data.config';
import { User } from '../model/user.model';
import { Epic } from '../model/epic.model';
import { Feature } from '../model/feature.model';
import { Task } from '../model/task.model';

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

    public getProjects(refresh?: boolean): Observable<ProjectRef[]> {
        let projects$: Observable<ProjectRef[]>;

        if (isPlatformBrowser(this.platformId) && !(refresh && this.allowRefresh())) {
            let projectsString: string = localStorage.getItem(ProjectRef.COLLECTION_NAME);
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
                projects$.take(1).subscribe((backendData: ProjectRef[]) => {
                    let localData = new LocalData<ProjectRef[]>(new Date().getTime(), backendData);
                    localStorage.setItem(ProjectRef.COLLECTION_NAME, JSON.stringify(localData));
                });
            }
        }
        return projects$;
    }

    public addProject(project: Project, user: User): Observable<any> {
        this.lastRefresh = 0;

        return this.addProjectToBackend(project, user);
    }

    public updateProject(project: ProjectRef, user: User): Promise<void> {
        this.lastRefresh = 0;

        return this.updateProjectInBackend(project, user);
    }

    public addEpic(project: ProjectRef, epic: Epic, user: User): Promise<void> {
        this.lastRefresh = 0;

        return this.addEpicInBackend(project, epic, user);
    }

    public updateEpic(project: ProjectRef, updatedEpic: Epic, epicIndex: number, user: User): Promise<void> {
        this.lastRefresh = 0;

        return this.updateEpicInBackend(project, updatedEpic, epicIndex, user);
    }

    public addFeature(project: ProjectRef, epicIndex: number, feature: Feature, user: User): Observable<any> {
        this.lastRefresh = 0;

        return this.addFeatureInBackend(project, epicIndex, feature, user);
    }

    public updateFeature(project: ProjectRef, updatedFeature: Feature, epicIndex: number, featureIndex: number, user: User): Promise<void> {
        this.lastRefresh = 0;

        return this.updateFeatureInBackend(project, updatedFeature, epicIndex, featureIndex, user);
    }

    public getTask(key: string): Observable<Task | null> {
        this.lastRefresh = 0;

        return this.getTaskFromBackend(key);
    }

    public addTask(project: ProjectRef, epicIndex: number, featureIndex: number, task: Task, user: User): Observable<any> {
        this.lastRefresh = 0;

        return this.addTaskInBackend(project, epicIndex, featureIndex, task, user);
    }

    public updateTask(project: ProjectRef, updatedTask: Task, epicIndex: number, featureIndex: number, taskIndex: number, user: User): Observable<any> {
        this.lastRefresh = 0;

        return this.updateTaskInBackend(project, updatedTask, epicIndex, featureIndex, taskIndex, user);
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

    protected abstract addProjectToBackend(project: Project, user: User);

    protected abstract updateProjectInBackend(project: ProjectRef, user: User): Promise<void>;

    protected abstract addEpicInBackend(project: ProjectRef, epic: Epic, user: User): Promise<void>;

    protected abstract updateEpicInBackend(project: ProjectRef, updatedEpic: Epic, epicIndex: number, user: User): Promise<void>;

    protected abstract addFeatureInBackend(project: ProjectRef, epicIndex: number, feature: Feature, user: User): Observable<any>;

    protected abstract updateFeatureInBackend(project: ProjectRef, updatedFeature: Feature, epicIndex: number, featureIndex: number, user: User): Promise<void>;

    protected abstract getTaskFromBackend(key: string): Observable<Task | null>;

    protected abstract addTaskInBackend(project: ProjectRef, epicIndex: number, featureIndex: number, task: Task, user: User): Observable<any>;

    protected abstract updateTaskInBackend(project: ProjectRef, updatedTask: Task, epicIndex: number, featureIndex: number,
        taskIndex: number, user: User): Observable<any>;
}
