import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetCommissionLogsParams, GetCommissionLogsResponse } from "../types/commissionLog.type";

export const commissionLogService = {

    getCommissionLogs: (params : GetCommissionLogsParams): Promise<GetCommissionLogsResponse> =>
        apiAxios<GetCommissionLogsResponse>("commission-logs", {
            method: HttpMethod.GET,
            params
        }),
};