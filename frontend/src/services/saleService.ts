import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetDistributorSalesResponse, CreateDistributorSalePayload, CreateDistributorSaleResponse, GetDistributorSalesParams } from "../types/sale.type";

export const saleService = {
    createDistributorSales: (data: CreateDistributorSalePayload[]): Promise<CreateDistributorSaleResponse> =>
        apiAxios<CreateDistributorSaleResponse>("distributor-sales", {
            method: HttpMethod.POST,
            data,
        }),

    getDistributorSales: (params : GetDistributorSalesParams): Promise<GetDistributorSalesResponse> => (
        apiAxios<GetDistributorSalesResponse>("distributor-sales", {
            method: HttpMethod.GET,
            params
        })
    )
};