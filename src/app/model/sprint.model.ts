import { Task } from "./task.model";

export class Sprint {
    public tasks: Task[];
    public createdOn: Object;
    public lastUpdatedOn: Object;
    
    constructor(public startTime: Date, public endTime: Date) { }
}