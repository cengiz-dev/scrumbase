import { Feature } from "./feature.model";

export class Epic {
    public description: string;
    public features: Feature[];
    public createdOn: Object;
    public lastUpdatedOn: Object;

    // TODO: public tasks: Task[] ?

    constructor(public title: string) { }
}