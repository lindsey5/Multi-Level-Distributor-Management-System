import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Variant } from "./variant.type";

export interface DistributorStock {
    _id: string;
    distributor_id: string;
    variant_id: string;
    quantity: number;
    variant: Variant;
    updatedAt: Date;
}

export interface GetStocksParams extends PaginationParams {
    search?: string;
    sortBy?: string;
    order?: "desc" | "asc";
}

export interface GetStocksResponse extends PaginationResponse {
    distributorStocks: DistributorStock[];
}