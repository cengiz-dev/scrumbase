import { TaskType } from "./task-type.model";
import { TaskStatus } from "./task-status.model";
import { TaskPriority } from "./task-priority.model";
import { User } from "./user.model";

export class TaskSummary {
    public key: string;
    public identifier: string;  // unique identifier ie: FEA-1
    public parent: TaskParent;
    public type: TaskType;
    public status: TaskStatus;
    public points: number;
    public priority: TaskPriority;
    public lastUpdatedOn: any;
    public lastUpdatedBy: User;

    constructor(public title: string) { }
}

export interface TaskParent {
    projectKey: string;
    epicIndex?: number;
    featureIndex?: number;
}

export class Task extends TaskSummary {
    public static COLLECTION_NAME = 'tasks';
    public static SEQUENCE_COLLECTION_NAME = Task.COLLECTION_NAME + '/seq';
    public description: string;
    public createdOn: any;
    public createdBy: User;

    // TODO:
    // assignedTo
    // subTasks ?

    constructor(title: string) {
        super(title);
    }

    // rest operator is not properly supported by typescript
    // public toTaskSummary(): TaskSummary {
    //     let {description, points, priority, status, ...result} = this;
    //     return result;
    // }
}

export interface TaskUpdate {
    type?: TaskType;
    title?: string;
    status?: TaskStatus;
    points?: number;
    priority?: TaskPriority;
    description?: string;
}

export function task2TaskSummary(task: Task): TaskSummary {
    let result: TaskSummary = new TaskSummary(task.title);
    if (task.key) result.key = task.key;
    if (task.identifier) result.identifier = task.identifier;
    if (task.parent) result.parent = { ...task.parent };
    if (task.type) result.type = task.type;
    if (task.status) result.status = task.status;
    if (task.points) result.points = task.points;
    if (task.priority) result.priority = task.priority;
    if (task.lastUpdatedOn) result.lastUpdatedOn = task.lastUpdatedOn;
    if (task.lastUpdatedBy) result.lastUpdatedBy = task.lastUpdatedBy;
    return result;
}

export function taskSummaryUpdatesFromTaskUpdate(taskUpdate: TaskUpdate): any {
    let result: any = { };
    if (taskUpdate.title) result.title = taskUpdate.title;
    if (taskUpdate.type) result.type = taskUpdate.type;
    if (taskUpdate.status) result.status = taskUpdate.status;
    return result;
}