// Shared types for the application

export interface DataJoinOut {
    analysis: {
        overview: string;
        answer: string;
        source?: string;
        [key: string]: any; // Allow arbitrary analysis fields
    };
    data: Record<string, any>[]; // Allow arbitrary data structure
}

export interface QueryResult {
    success: boolean;
    results: DataJoinOut[];
    count: number;
    userQuery: string;
    executionTime: number;
}
