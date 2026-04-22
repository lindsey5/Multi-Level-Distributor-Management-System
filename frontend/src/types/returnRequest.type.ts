import type { Distributor } from "./distributor.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Variant } from "./variant.type";

interface ReturnItem {
    _id: string;
    variant_id: string;
    quantity: number;
    variant: Variant;
    status: 'pending' | 'rejected' | 'expired' | 'insufficient stock' | 'cancelled'
}

export interface ReturnRequest {
    _id: string;
    distributor_id: string;
    distributor: Distributor;
    items: ReturnItem[];
    reason: string;
    createdAt: string;
}

interface ItemPayload {
    variant_id: string;
    quantity: number;
}

export interface CreateReturnRequestPayload {
    items: ItemPayload[];
    reason: string;
}

export interface ReturnRequestResponse {
    message: string;
    returnRequest: ReturnRequest;
}

export interface GetReturnRequestsParams extends PaginationParams{
    startDate?: string;
    endDate?: string;
}

export interface GetReturnRequestResponse extends PaginationResponse {
    returnRequests: ReturnRequest[];
}
