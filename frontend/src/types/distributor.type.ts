import type { PaginationResponse } from "./pagination.type";

export interface Distributor {
    _id: string;
    parent_distributor_id?: string;
    parent_distributor: Distributor;
    distributor_name: string;
    commission_rate: number;
    wallet_balance: number;
    email: string;
    password: string;
    status: "active" | "deleted";
    total_stocks?: number;
    createdAt: Date;
}

export interface CreatDistributorDTO {
    distributor_name: string;
    email: string;
}

export interface GetDistributorsParams{
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc"
}

export interface GetDistributorsResponse extends PaginationResponse {
    distributors: Distributor[]
}