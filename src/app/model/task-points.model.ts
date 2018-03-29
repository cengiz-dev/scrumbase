export enum TaskPointsFibonacci {
    ZERO = '0',
    ONE = '1',
    TWO = '2',
    THREE = '3',
    FIVE = '5',
    EIGHT = '8',
    THIRTEEN = '13',
    TWENTY_ONE = '21',
    THIRTY_FOUR = '34',
    FIFTY_FIVE = '55',
}

export enum TaskPointsPowersOf2 {
    ZERO = '0',
    ONE = '1',
    TWO = '2',
    FOUR = '4',
    EIGHT = '8',
    SIXTEEN = '16',
    THIRTY_TWO = '32',
    SIXTY_FOUR = '64',
    HUNDRED_TWENTY_EIGHT = '128',
    TWO_HUNDRED_FIFTY_SIX = '256',
}

export enum TaskPointsLinear {
    ZERO = '0',
    ONE = '1',
    TWO = '2',
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    EIGHT = '8',
    NINE = '9',
}

export type TaskPriority = TaskPointsFibonacci | TaskPointsPowersOf2 | TaskPointsLinear;