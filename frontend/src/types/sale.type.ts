
import type { Distributor } from "./distributor.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Product } from "./product.type";
import type { Variant } from "./variant.type";

export interface DistributorSale {
    _id: string;
    seller_id: string; 
    seller: Distributor;
    variant_id: string;
    product: Product;
    variant: Variant;
    quantity: number;
    total_amount: number;
    commission: number;
    parent_commission: number;
    createdAt: string;
    parent_distributor: Distributor;
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

export type Period = "today" | "this-week" | "this-month" | "this-year";

export interface GetDistributorSalesByPeriodResponse {
    sales: number;
}

export interface GetDistributorItemsSoldResponse {
    totalQuantity: number;
}

export interface GetDistributorMonthlySalesResponse {
    monthlySales: { month: string, totalSales: number }[];
    year: number;
}

export interface GetDistributorItemsSoldPerMonthResponse {
    itemsSoldPerMonth: { month: string, totalQuantity: number }[];
    year: number;
}