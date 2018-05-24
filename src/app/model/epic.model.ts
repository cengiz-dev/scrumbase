import { Feature } from "./feature.model";
import { User } from "./user.model";
import { TaskSummary } from "./task.model";

export class Epic {
    public description: string;
    public taskPrefix: string;
    public features: Feature[];
    public tasks: TaskSummary[];
    public createdOn: any;
    public createdBy: User;
    public lastUpdatedOn: any;
    public lastUpdatedBy: User;

    constructor(public title: string) { }
}

export interface EpicUpdate {
    title?: string;
    description?: string;
}