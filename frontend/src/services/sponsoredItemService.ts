import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreateSponsoredItemPayload, CreateSponsoredItemResponse, GetSponsoredItemResponse, GetSponsoredItemsParams, GetSponsoredItemsResponse, UpdateSponsoredItemResponse } from "../types/sponsored-item.type";

export const sponsoredItemService = {
    getSponsoredItems: (params : GetSponsoredItemsParams) =>
        apiAxios<GetSponsoredItemsResponse>("sponsored-items", {
            method: HttpMethod.GET,
            params
        }),
    createSponsoredItem: (data : CreateSponsoredItemPayload) =>
        apiAxios<CreateSponsoredItemResponse>("sponsored-items", {
            method: HttpMethod.POST,
            data
        }),
    
    getSponsoredItemById: (id: string) => 
        apiAxios<GetSponsoredItemResponse>(`sponsored-items/${id}`, {
            method: HttpMethod.GET,
        }),

    updateSponsoredItemStatus: (id: string, status: string) => 
        apiAxios<UpdateSponsoredItemResponse>(`sponsored-items/${id}`, {
            method: HttpMethod.PATCH,
            data: { status }
        }),
};