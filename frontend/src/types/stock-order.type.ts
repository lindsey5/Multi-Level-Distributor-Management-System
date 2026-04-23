import type { Distributor } from "./distributor.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Variant } from "./variant.type";

export interface StockOrder {
    _id: string;
    distributor_id: string;
    distributor: Distributor;
    items: {
        variant: Variant;
        variant_id: string;
        quantity: number;
        status: 'pending' | 'accepted' | 'received' | 'rejected' | 'cancelled' | 'insufficient stock'
    }
}

export interface CreateStockOrderPayload {
    variant_id: string;
    quantity: number;
}

export interface CreateStockOrderResponse {
    message?: string;
    stockOrder: StockOrder
}

export interface GetStockOrdersParams extends PaginationParams {
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
}

export interface GetStockOrdersResponse extends PaginationResponse {
    stockOrders: StockOrder[];
}