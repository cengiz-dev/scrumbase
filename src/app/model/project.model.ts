import { ProjectSettings, TaskPriorityScheme, TaskPointScheme } from "./project-settings.model";
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

    constructor(public title: string) {
        // set default values for project settings
        this.settings = new ProjectSettings(TaskPriorityScheme.MOSCOW, TaskPointScheme.FIBONACCI);
    }
}

export class ProjectRef extends Project {
    public static COLLECTION_NAME = 'projects';
    constructor(public key: string, public title: string) {
        super(title);
    }
}
