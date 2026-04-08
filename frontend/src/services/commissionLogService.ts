import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetCommissionLogsParams, GetCommissionLogsResponse, GetCommissionsPerMonthResponse } from "../types/commissionLog.type";

export const commissionLogService = {

    getCommissionLogs: (params : GetCommissionLogsParams): Promise<GetCommissionLogsResponse> =>
        apiAxios<GetCommissionLogsResponse>("commission-logs", {
            method: HttpMethod.GET,
            params
        }),
    
    getCommissionsPerMonth: (year: number) => (
        apiAxios<GetCommissionsPerMonthResponse>(`commission-logs/monthly?year=${year}`, {
            method: HttpMethod.GET
        })
    ),
};