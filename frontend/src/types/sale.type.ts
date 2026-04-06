
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Variant } from "./variant.type";

export interface DistributorSale {
    _id: string;
    seller_id: string; 
    variant_id: string;
    variant: Variant;
    quantity: number;
    total_amount: number;
    createdAt: string;
}

export interface CreateDistributorSalePayload {
    variant_id: string;
    quantity: number;
    total_amount: number;
}

export interface CreateDistributorSaleResponse {
    message: string;
    total_amount: number;
    distributorCommission: number;
    sales: DistributorSale[]
}

export interface GetDistributorSalesParams extends PaginationParams {
    sortBy?: string;
    order?: 'asc' | 'desc',
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface GetDistributorSalesResponse extends PaginationResponse {
    distributorSales: DistributorSale[];
    totalSales: number;
}