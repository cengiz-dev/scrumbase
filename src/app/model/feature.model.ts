import { Task } from "./task.model";

export class Feature {
    public description: string;
    public tasks: Task[];
    public createdOn: any;
    public lastUpdatedOn: any;

    constructor(public title: string) { }
}