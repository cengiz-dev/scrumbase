import { Task } from "./task.model";
import { User } from "./user.model";

export class Sprint {
    public tasks: Task[];
    public createdOn: any;
    public createdBy: User;
    public lastUpdatedOn: any;
    public lastUpdatedBy: User;
    
    constructor(public title: string, public startTime: Date, public endTime: Date) { }
}