import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { UpdateDistributorPayload, UpdateDistributorResponse } from "../types/distributor.type";

export const distributorService = {
    updateDistributor: (data : UpdateDistributorPayload) : Promise<UpdateDistributorResponse> => (
        apiAxios<UpdateDistributorResponse> ("distributors", {
            method: HttpMethod.PUT,
            data
        })
    ),

    getDistributorBalance: (): Promise<{ wallet_balance: number }> =>
        apiAxios<{ wallet_balance: number }>("distributors/balance", {
            method: HttpMethod.GET,
        }),
};