import { useQuery } from "@tanstack/react-query";
import type { GetStockTransferLogsParams, GetStockTransferLogsResponse } from "../../types/stock-transfer.type";
import { stockTransferLogService } from "../../services/stockTransferService";

export const useGetStockTransferLogs = (params : GetStockTransferLogsParams) => (
    useQuery<GetStockTransferLogsResponse, Error>({
        queryKey: ['stocks', params],
        queryFn: () => stockTransferLogService.getStockTransferLogs(params),
        refetchOnWindowFocus: false,
    })
)