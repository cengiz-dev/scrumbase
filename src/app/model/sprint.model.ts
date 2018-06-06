import { Task } from "./task.model";
import { User } from "./user.model";

export class Sprint {
    public title: string;
    public startTime: Date;
    public endTime: Date;
    public taskKeys: string[];
    public createdOn: any;
    public createdBy: User;
    public lastUpdatedOn: any;
    public lastUpdatedBy: User;
    
    constructor() { }
}

export interface SprintUpdate {
    title?: string;
    startTime?: Date;
    endTime?: Date;
    lastUpdatedOn?: any;
    lastUpdatedBy?: User;
}