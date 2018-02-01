export class Project {
    constructor(public title: string, public summary: string) { }
}

export let PROJECT_LIST = [
    new Project('project1', 'project1 summary'),
    new Project('project2', 'project2 summary')
];
