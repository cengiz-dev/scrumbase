import { Feature } from "./feature.model";

export class Epic {
    public description: string;
    public features: Feature[];

    // TODO: public tasks: Task[] ?
    
    constructor(public title: string) { }
}