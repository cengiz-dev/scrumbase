import { TaskType } from "./task-type.model";
import { TaskStatus } from "./task-status.model";
import { TaskPriority } from "./task-priority.model";

export class Task {
    public description: string;
    public points: number;
    public priority: TaskPriority;
    public status: TaskStatus;
    public subTasks: Task[];
    public createdOn: any;
    public lastUpdatedOn: any;

    // TODO:
    // createdBy
    // assignedTo
    // sprints ?

    constructor(public title: string) { }
}