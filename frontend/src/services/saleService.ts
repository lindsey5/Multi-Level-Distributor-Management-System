import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetDistributorSalesResponse, CreateDistributorSalePayload, CreateDistributorSaleResponse, GetDistributorSalesParams, GetDistributorItemsSoldPerMonthResponse, GetDistributorMonthlySalesResponse, GetDistributorItemsSoldResponse, Period, GetDistributorSalesByPeriodResponse } from "../types/sale.type";

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
    ),

    getDistributorSalesByPeriod: (period: Period) => (
        apiAxios<GetDistributorSalesByPeriodResponse>(`distributor-sales/${period}`, {
            method: HttpMethod.GET
        })
    ),

    getDistributorItemsSoldByPeriod: (period: Period) => (
        apiAxios<GetDistributorItemsSoldResponse>(`distributor-sales/items/${period}`, {
            method: HttpMethod.GET
        })
    ),

    getDistributorMonthlySales: (year: number) => (
        apiAxios<GetDistributorMonthlySalesResponse>(`distributor-sales/monthly?year=${year}`, {
            method: HttpMethod.GET
        })
    ),

    getDistributorItemsSoldPerMonth: (year: number) => (
        apiAxios<GetDistributorItemsSoldPerMonthResponse>(`distributor-sales/items-sold?year=${year}`, {
            method: HttpMethod.GET
        })
    ),
};