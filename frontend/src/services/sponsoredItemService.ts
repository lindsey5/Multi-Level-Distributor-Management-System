import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreateSponsoredItemPayload, CreateSponsoredItemResponse, GetSponsoredItemsParams, GetSponsoredItemsResponse } from "../types/sponsored-item.type";

export const sponsoredItemService = {
    getSponsoredItems: (params : GetSponsoredItemsParams) =>
        apiAxios<GetSponsoredItemsResponse>("sponsored-items", {
            method: HttpMethod.GET,
            params
        }),
    createSponsoredItem: (data : CreateSponsoredItemPayload) =>
        apiAxios<CreateSponsoredItemResponse>("sponsored-items", {
            method: HttpMethod.GET,
            data
        }),
};