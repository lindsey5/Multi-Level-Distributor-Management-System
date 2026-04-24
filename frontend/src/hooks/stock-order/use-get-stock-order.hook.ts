import { useQuery } from "@tanstack/react-query";
import type { GetStockOrderResponse } from "../../types/stock-order.type";
import { stockOrderService } from "../../services/stockOrderService";

export const useGetStockOrderById = (id : string) => (
    useQuery<GetStockOrderResponse, Error>({
        queryKey: [`stock-orders/${id}`],
        queryFn: () => stockOrderService.getStockOrderById(id),
        refetchOnWindowFocus: false,
    })
)