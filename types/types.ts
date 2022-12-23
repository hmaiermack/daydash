export interface GraphDay {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4
}

export interface GraphResponse {
    intervalData: GraphDay[],
    adherencePercentage: number
}