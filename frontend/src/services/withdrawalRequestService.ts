import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreateWithdrawalRequestPayload, CreateWithdrawalRequestResponse } from "../types/withdrawalRequest.type";

export const withdrawalRequestService = {
    createWithdrawalRequest: (data: CreateWithdrawalRequestPayload) =>
        apiAxios<CreateWithdrawalRequestResponse>("withdrawal-requests", {
            method: HttpMethod.POST,
            data,
        }),

};