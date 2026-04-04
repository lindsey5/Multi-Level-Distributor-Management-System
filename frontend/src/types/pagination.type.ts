export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationResponse {
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}