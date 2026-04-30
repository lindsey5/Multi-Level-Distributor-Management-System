import { useQuery } from "@tanstack/react-query";
import type { GetWithdrawalRequestsParams, GetWithdrawalRequestsResponse } from "../../types/withdrawalRequest.type";
import { withdrawalRequestService } from "../../services/withdrawalRequestService";

export const useGetWithdrawalRequests = (params : GetWithdrawalRequestsParams) => (
    useQuery<GetWithdrawalRequestsResponse, Error>({
        queryKey: ["withdrawal-requests", params],
        queryFn: () => withdrawalRequestService.getWithdrawalRequests(params),
        refetchOnWindowFocus: false,
    })
)