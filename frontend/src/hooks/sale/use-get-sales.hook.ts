import { useQuery } from "@tanstack/react-query";
import type { GetDistributorSalesParams, GetDistributorSalesResponse } from "../../types/sale.type";
import { saleService } from "../../services/saleService";

export const useGetSales = (params : GetDistributorSalesParams) => (
    useQuery<GetDistributorSalesResponse, Error>({
        queryKey: ['sales', params],
        queryFn: () => saleService.getDistributorSales(params),
        refetchOnWindowFocus: false,
    })
)