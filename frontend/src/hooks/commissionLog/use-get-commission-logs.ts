import { useQuery } from "@tanstack/react-query";
import type { GetCommissionLogsParams, GetCommissionLogsResponse } from "../../types/commissionLog.type";
import { commissionLogService } from "../../services/commissionLogService";

export const useGetCommissionLogs = (params : GetCommissionLogsParams) => (
    useQuery<GetCommissionLogsResponse, Error>({
        queryKey: ['commission-logs', params],
        queryFn: () => commissionLogService.getCommissionLogs(params),
        refetchOnWindowFocus: false,
    })
)