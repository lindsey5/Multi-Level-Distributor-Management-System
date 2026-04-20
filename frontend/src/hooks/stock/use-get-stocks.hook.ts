import { useQuery } from "@tanstack/react-query";
import { stockService } from "../../services/stockService";
import type { GetStocksParams, GetStocksResponse } from "../../types/stock.type";

export const useGetStocks = (params : GetStocksParams) => (
    useQuery<GetStocksResponse, Error>({
        queryKey: ['stocks', params],
        queryFn: () => stockService.getStocks(params),
        refetchOnWindowFocus: false,
    })
)