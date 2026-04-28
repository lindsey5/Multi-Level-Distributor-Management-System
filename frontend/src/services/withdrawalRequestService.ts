import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { ReturnRequestResponse } from "../types/returnRequest.type";
import type { CreateWithdrawalRequestPayload } from "../types/withdrawalRequest.type";

export const withdrawalRequestService = {
    createWithdrawalRequest: (data: CreateWithdrawalRequestPayload) =>
        apiAxios<ReturnRequestResponse>("withdrawal-requests", {
            method: HttpMethod.POST,
            data,
        }),

};