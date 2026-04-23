import { useQuery } from "@tanstack/react-query";
import type { GetStockOrdersParams, GetStockOrdersResponse } from "../../types/stock-order.type";
import { stockOrderService } from "../../services/stockOrderService";

export const useGetStockOrders = (params : GetStockOrdersParams) => (
    useQuery<GetStockOrdersResponse, Error>({
        queryKey: ['stock-orders', params],
        queryFn: () => stockOrderService.getStockOrders(params),
        refetchOnWindowFocus: false,
    })
)