import { Task } from "./task.model";

export class Feature {
    public description: string;
    public tasks: Task[];
    public createdOn: Object;
    public lastUpdatedOn: Object;

    constructor(public title: string) { }
}