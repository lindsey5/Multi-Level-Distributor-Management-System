import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreateWithdrawalRequestPayload, CreateWithdrawalRequestResponse, GetWithdrawalRequestsParams, GetWithdrawalRequestsResponse, UpdateWithdrawalRequestPayload, UpdateWithdrawalRequestResponse } from "../types/withdrawalRequest.type";

export const withdrawalRequestService = {
    createWithdrawalRequest: (data: CreateWithdrawalRequestPayload) =>
        apiAxios<CreateWithdrawalRequestResponse>("withdrawal-requests", {
            method: HttpMethod.POST,
            data,
        }),

    updateWithdrawalRequestStatus: (payload : UpdateWithdrawalRequestPayload) => (
        apiAxios<UpdateWithdrawalRequestResponse>(`withdrawal-requests/${payload.id}`, {
            method: HttpMethod.PATCH,
            data: { status: payload.status }
        })
    ),

    getWithdrawalRequests: (params : GetWithdrawalRequestsParams) =>
        apiAxios<GetWithdrawalRequestsResponse>("withdrawal-requests", {
            method: HttpMethod.GET,
            params
        }),
};