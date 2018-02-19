import { Task } from "./task.model";

export class Sprint {
    public tasks: Task[];
    constructor(public startTime: Date, public endTime: Date) { }
}