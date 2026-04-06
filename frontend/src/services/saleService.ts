import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreateDistributorSalePayload, CreateDistributorSaleResponse } from "../types/sale.type";

export const saleService = {
    createDistributorSales: (data: CreateDistributorSalePayload[]): Promise<CreateDistributorSaleResponse> =>
        apiAxios<CreateDistributorSaleResponse>("distributor-sales", {
            method: HttpMethod.POST,
            data,
        }),
};