export interface Day {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4
}

export interface GraphResponse {
    intervalData: Day[],
    adherencePercentage: number
}