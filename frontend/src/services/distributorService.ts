import { apiAxios, HttpMethod } from "../lib/api/apiAxios";

export const distributorService = {
    getDistributorBalance: (): Promise<{ wallet_balance: number }> =>
        apiAxios<{ wallet_balance: number }>("distributors/balance", {
            method: HttpMethod.GET,
        }),
};