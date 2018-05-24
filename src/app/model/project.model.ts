import { ProjectSettings, TaskPriorityScheme, TaskPointScheme } from "./project-settings.model";
import { Epic } from "./epic.model";
import { Sprint } from "./sprint.model";
import { User } from "./user.model";
import { TaskSummary } from "./task.model";

export class Project {
    public description: string;
    public settings: ProjectSettings;
    public taskPrefix: string;
    public epics: Epic[];
    public tasks: TaskSummary[];
    public sprints: Sprint[];
    public createdOn: any;
    public createdBy: User;
    public lastUpdatedOn: any;
    public lastUpdatedBy: User;

    constructor(public title: string) {
        // set default values for project settings
        this.settings = new ProjectSettings(TaskPriorityScheme.MOSCOW, TaskPointScheme.FIBONACCI);
    }
}

export interface ProjectUpdate {
    title?: string;
    description?: string;
    settings?: ProjectSettings;
}

export class ProjectRef extends Project {
    public static COLLECTION_NAME = 'projects';
    constructor(public key: string, public title: string) {
        super(title);
    }
}
