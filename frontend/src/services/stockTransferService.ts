import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetStockTransferLogsParams, GetStockTransferLogsResponse } from "../types/stock-transfer.type";

export const stockTransferLogService = {
    getStockTransferLogs: (params: GetStockTransferLogsParams): Promise<GetStockTransferLogsResponse> => (
        apiAxios<GetStockTransferLogsResponse>(`stock-transfer-logs`,{
            method: HttpMethod.GET,
            params
        })
    ),
};