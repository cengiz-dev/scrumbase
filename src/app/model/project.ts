export class Project {
    constructor(public title: string, public summary: string) { }
}

export class ProjectRef extends Project {
    public static COLLECTION_NAME = 'projects';
    constructor(public id: string, public title: string, public summary: string) {
        super(title, summary);
    }
}
