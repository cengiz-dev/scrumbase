import { Feature } from "./feature.model";
import { User } from "./user.model";

export class Epic {
    public description: string;
    public features: Feature[];
    public createdOn: any;
    public createdBy: User;
    public lastUpdatedOn: any;
    public lastUpdatedBy: User;

    // TODO: public tasks: Task[] ?

    constructor(public title: string) { }
}