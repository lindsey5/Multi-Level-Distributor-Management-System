
export interface PaginationResponse {
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}