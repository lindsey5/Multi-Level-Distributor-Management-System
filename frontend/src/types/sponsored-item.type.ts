import type { Distributor } from "./distributor.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Variant } from "./variant.type";

export interface SponsoredItem {
    _id: string;
    sponsored_id: string;
    distributor: Distributor;
    distributor_id: string;
    variant_id: string;
    variant: Variant;
    quantity: number;
    status: 'pending' | 'approved' | 'completed' |  'rejected' | 'expired' | 'cancelled';
    createdAt: string;
}

export interface CreateSponsoredItemPayload {
    variant_id: string;
    quantity: number;
}

export interface CreateSponsoredItemResponse {
    message: string;
    sponsoredItem: SponsoredItem;
}

export interface GetSponsoredItemsParams extends PaginationParams {
    sortBy?: string;
    order?: 'asc' | 'desc',
    startDate?: string;
    endDate?: string;
    search?: string;
    status?: string;
}

export interface GetSponsoredItemsResponse extends PaginationResponse {
    sponsoredItems: SponsoredItem[];
}

export interface GetSponsoredItemResponse {
    sponsoredItem: SponsoredItem;
}

export interface UpdateSponsoredItemResponse {
    message?: string;
    sponsoredItem: SponsoredItem;
}