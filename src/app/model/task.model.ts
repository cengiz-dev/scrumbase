import { TaskType } from "./task-type.model";
import { TaskStatus } from "./task-status.model";
import { TaskPriority } from "./task-priority.model";
import { User } from "./user.model";

export class TaskSummary {
    public description: string;
    public type: TaskType;
    public createdOn: any;
    public createdBy: User;
    public lastUpdatedOn: any;
    public lastUpdatedBy: User;

    constructor(public title: string) { }
}

export class Task extends TaskSummary {
    public points: number;
    public priority: TaskPriority;
    public status: TaskStatus;

    // TODO:
    // assignedTo
    // subTasks ?
    // sprints ?

    constructor(title: string) {
        super(title);
    }
}

export class TaskRef extends Task {
    public static COLLECTION_NAME = 'tasks';
    constructor(public id: string, public title: string) {
        super(title);
    }
}