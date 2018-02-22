export enum TaskPriorityScheme {
    MOSCOW = 'MOSCOW',
    SEVERITY = 'SEVERITY',
    LEVEL = 'LEVEL',
}

export enum TaskPointScheme {
    FIBONACCI = 'FIBONACCI',
    POWERS_OF_2 = 'POWERS OF 2',
    LINEAR = 'LINEAR',
}

export class ProjectSettings {
    constructor(public priorityScheme: TaskPriorityScheme = TaskPriorityScheme.MOSCOW,
        public pointScheme: TaskPointScheme = TaskPointScheme.FIBONACCI) { }
}