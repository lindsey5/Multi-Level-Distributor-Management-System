import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetStockTransferLogsParams, GetStockTransferLogsResponse, UpdateStockTransferLogResponse } from "../types/stock-transfer.type";

export const stockTransferLogService = {
    getStockTransferLogs: (params: GetStockTransferLogsParams): Promise<GetStockTransferLogsResponse> => (
        apiAxios<GetStockTransferLogsResponse>(`stock-transfer-logs`,{
            method: HttpMethod.GET,
            params
        })
    ),

    updateStockTransferLogStatus: (id : string, status : string) => {
        return apiAxios<UpdateStockTransferLogResponse>(`stock-transfer-logs/${id}`, {
            method: HttpMethod.PATCH,
            data: { status }
        })
    }
};