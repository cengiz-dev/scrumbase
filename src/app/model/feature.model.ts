import { TaskSummary } from "./task.model";
import { User } from "./user.model";

export class Feature {
    public description: string;
    public taskPrefix: string;
    public tasks: TaskSummary[];
    public createdOn: any;
    public createdBy: User;
    public lastUpdatedOn: any;
    public lastUpdatedBy: User;

    constructor(public title: string) { }
}

export interface FeatureUpdate {
    title?: string;
    description?: string;
}