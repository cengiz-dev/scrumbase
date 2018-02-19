export enum TaskPriorityType {
    MOSCOW = 'MOSCOW',
    SEVERITY = 'SEVERITY',
    LEVEL = 'LEVEL',
}

export enum PointSchemeType {
    FIBONACCI = 'FIBONACCI',
    POWERS_OF_2 = 'POWERS_OF_2',
    LINEAR = 'LINEAR',
}

export class ProjectSettings {
    constructor(public prioritization: TaskPriorityType = TaskPriorityType.MOSCOW,
        public pointScheme: PointSchemeType = PointSchemeType.FIBONACCI) { }
}