import { useQuery } from "@tanstack/react-query";
import type { GetCommissionsPerMonthResponse } from "../../types/commissionLog.type";
import { commissionLogService } from "../../services/commissionLogService";

export const useGetCommissionsPerMonth = (year: number = 2024) => (
    useQuery<GetCommissionsPerMonthResponse, Error>({
        queryKey: [`commission-logs/monthly`, year],
            queryFn: () => commissionLogService.getCommissionsPerMonth(year),
            placeholderData: (prev) => prev,
            refetchOnWindowFocus: false,
    })
)