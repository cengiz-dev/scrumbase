import { ProjectSettings } from "./project-settings.model";
import { Epic } from "./epic.model";
import { Sprint } from "./sprint.model";

export class Project {
    public description: string;
    public settings: ProjectSettings;
    public epics: Epic[];
    public sprints: Sprint[];
    public createdOn: any;
    public lastUpdatedOn: any;

    // TODO:
    // createdBy
    // lastUpdatedBy
    // tasks ?

    constructor(public title: string, public summary: string) { }
}

export class ProjectRef extends Project {
    public static COLLECTION_NAME = 'projects';
    constructor(public id: string, public title: string, public summary: string) {
        super(title, summary);
    }
}