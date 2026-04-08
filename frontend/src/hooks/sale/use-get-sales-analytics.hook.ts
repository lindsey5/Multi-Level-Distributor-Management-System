import { useQuery } from "@tanstack/react-query";
import type { GetDistributorItemsSoldPerMonthResponse, GetDistributorItemsSoldResponse, GetDistributorMonthlySalesResponse, GetDistributorSalesByPeriodResponse, Period } from "../../types/sale.type";
import { saleService } from "../../services/saleService";

export const useGetDistributorSalesByPeriod = (period: Period) => (
    useQuery<GetDistributorSalesByPeriodResponse, Error>({
        queryKey: [`distributor-sales/${period}`],
        queryFn: () => saleService.getDistributorSalesByPeriod(period),
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
    })
)

export const useGetDistributorItemsSoldByPeriod = (period: Period) => (
    useQuery<GetDistributorItemsSoldResponse, Error>({
        queryKey: [`distributor-sales/${period}/items`],
        queryFn: () => saleService.getDistributorItemsSoldByPeriod(period),
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
    })
)

export const useGetDistributorMonthlySales = (year: number = 2024) => (
        useQuery<GetDistributorMonthlySalesResponse, Error>({
        queryKey: [`distributor-sales/monthly`, year],
        queryFn: () => saleService.getDistributorMonthlySales(year),
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
    })
)

export const userGetDistributorItemsSoldPerMonth = (year: number = 2024) => (
        useQuery<GetDistributorItemsSoldPerMonthResponse, Error>({
        queryKey: [`distributor-sales/items-sold`, year],
        queryFn: () => saleService.getDistributorItemsSoldPerMonth(year),
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
    })
)