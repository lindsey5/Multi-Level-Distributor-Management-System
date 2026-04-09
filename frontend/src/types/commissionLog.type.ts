import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { DistributorSale } from "./sale.type";

export interface CommissionLog {
    _id: string;
    sale_ids: string[];
    sales: DistributorSale[];
    receiver_id: string;
    commission_rate: number;
    commission_amount: number;
    createdAt: string;
}

export interface GetCommissionLogsParams extends PaginationParams {}

export interface GetCommissionLogsResponse extends PaginationResponse {
    commissionLogs: CommissionLog[];
}

export interface GetCommissionsPerMonthResponse {
    commissionsPerMonth: { month: string, totalCommission: number }[];
    year: number;
}