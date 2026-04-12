import type { Variant } from "./variant.type";

interface ReturnItem {
    variant_id: string;
    quantity: number;
    variant: Variant;
}

export interface ReturnRequest {
    distributor_id: string;
    items: ReturnItem[];
    reason: string;
    createdAt: string;
}

export interface CreateReturnRequestPayload {
    items: {
        variant_id: string;
        quantity: number;
    }[],
    reason: string;
}

export interface CreateReturnRequestResponse {
    message: string;
    returnRequest: ReturnRequest;
}