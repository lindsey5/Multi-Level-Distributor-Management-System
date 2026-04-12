import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreateReturnRequestPayload, CreateReturnRequestResponse } from "../types/returnRequest.type";

export const returnRequestService = {
    createReturnRequest: (data: CreateReturnRequestPayload) =>
        apiAxios<CreateReturnRequestResponse>("return-requests", {
            method: HttpMethod.POST,
            data,
        }),
};