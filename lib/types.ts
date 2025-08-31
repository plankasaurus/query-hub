// Shared types for the application

export interface DataJoinOut {
    result: string;
    overview: string;
    source: string;
    filename: string;
    analysis: {
        key_findings: string[];
        trends: string[];
    };
    data_used: any[];
}

export interface QueryResult {
    success: boolean;
    results: DataJoinOut[];
    count: number;
    userQuery: string;
    aggregate?: string;
    executionTime: number;
}
