import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetReturnRequestResponse, CreateReturnRequestPayload, ReturnRequestResponse, GetReturnRequestsParams } from "../types/returnRequest.type";

export const returnRequestService = {
    createReturnRequest: (data: CreateReturnRequestPayload) =>
        apiAxios<ReturnRequestResponse>("return-requests", {
            method: HttpMethod.POST,
            data,
        }),

    getReturnRequests: (params: GetReturnRequestsParams) =>
        apiAxios<GetReturnRequestResponse>("return-requests", {
            method: HttpMethod.GET,
            params
        }),

    cancelReturnRequest: (id: string) =>
        apiAxios<ReturnRequestResponse>(`return-requests/cancel/${id}`, {
            method: HttpMethod.PATCH,
        }) 

};