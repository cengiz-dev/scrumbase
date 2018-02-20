import { Task } from "./task.model";

export class Sprint {
    public tasks: Task[];
    public createdOn: any;
    public lastUpdatedOn: any;
    
    constructor(public startTime: Date, public endTime: Date) { }
}