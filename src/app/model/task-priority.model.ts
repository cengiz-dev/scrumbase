export enum TaskPriorityMoscow {
    MUST_DO = 'MUST_DO',
    SHOULD_DO = 'SHOULD_DO',
    CAN_DO = 'CAN_DO',
    WONT_DO = 'WONT_DO',
}

export enum TaskPrioritySeverity {
    CRITICAL = 'CRITICAL',
    IMPORTANT = 'IMPORTANT',
    NORMAL = 'NORMAL',
    MINOR = 'MINOR',
}

export enum TaskPriorityLevel {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
}

export type TaskPriority = TaskPriorityMoscow | TaskPriorityLevel | TaskPrioritySeverity;