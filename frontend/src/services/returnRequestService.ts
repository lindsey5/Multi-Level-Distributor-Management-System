import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetReturnRequestResponse, CreateReturnRequestPayload, CreateReturnRequestResponse, GetReturnRequestsParams } from "../types/returnRequest.type";

export const returnRequestService = {
    createReturnRequest: (data: CreateReturnRequestPayload) =>
        apiAxios<CreateReturnRequestResponse>("return-requests", {
            method: HttpMethod.POST,
            data,
        }),

    getReturnRequests: (params: GetReturnRequestsParams) =>
        apiAxios<GetReturnRequestResponse>("return-requests", {
            method: HttpMethod.GET,
            params
        }) 

};