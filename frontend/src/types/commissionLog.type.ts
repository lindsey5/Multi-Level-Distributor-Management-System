import type { PaginationParams, PaginationResponse } from "./pagination.type";

export interface CommissionLog {
    _id: string;
    receiver_id: string;
    commission_rate: number;
    commission_amount: number;
    createdAt: string;
}

export interface GetCommissionLogsParams extends PaginationParams {}

export interface GetCommissionLogsResponse extends PaginationResponse {
    commissionLogs: CommissionLog[];
}