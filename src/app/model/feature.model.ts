import { Task } from "./task.model";

export class Feature {
    public description: string;
    public tasks: Task[];
    
    constructor(public title: string) { }
}