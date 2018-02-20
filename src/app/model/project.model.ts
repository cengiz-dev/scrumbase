import { ProjectSettings } from "./project-settings.model";
import { Epic } from "./epic.model";
import { Sprint } from "./sprint.model";
import { User } from "./user.model";

export class Project {
    public description: string;
    public settings: ProjectSettings;
    public epics: Epic[];
    public sprints: Sprint[];
    public createdOn: any;
    public createdBy: User;
    public lastUpdatedOn: any;
    public lastUpdatedBy: User;

    // TODO:
    // tasks ?

    constructor(public title: string) { }
}

export class ProjectRef extends Project {
    public static COLLECTION_NAME = 'projects';
    constructor(public id: string, public title: string) {
        super(title);
    }
}
