import type { Distributor } from "./distributor.type";
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