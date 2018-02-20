import { Feature } from "./feature.model";

export class Epic {
    public description: string;
    public features: Feature[];
    public createdOn: any;
    public lastUpdatedOn: any;

    // TODO: public tasks: Task[] ?

    constructor(public title: string) { }
}