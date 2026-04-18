import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetStockTransferLogsParams, GetStockTransferLogsResponse, UpdateStockTransferLogResponse } from "../types/stock-transfer.type";

export const stockTransferLogService = {
    getStockTransferLogs: (params: GetStockTransferLogsParams): Promise<GetStockTransferLogsResponse> => (
        apiAxios<GetStockTransferLogsResponse>(`stock-transfer-logs`,{
            method: HttpMethod.GET,
            params
        })
    ),

    markStockTransferLogAsReceived: (id : string) => {
        return apiAxios<UpdateStockTransferLogResponse>(`stock-transfer-logs/${id}/received`, {
            method: HttpMethod.PATCH,
        })
    }
};