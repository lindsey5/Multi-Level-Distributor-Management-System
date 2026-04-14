import { useQuery } from "@tanstack/react-query";
import type { GetReturnRequestResponse, GetReturnRequestsParams } from "../../types/returnRequest.type";
import { returnRequestService } from "../../services/returnRequestService";

export const useGetReturnRequests = (params : GetReturnRequestsParams) => (
    useQuery<GetReturnRequestResponse, Error>({
        queryKey: ["return-requests", params],
        queryFn: () => returnRequestService.getReturnRequests(params),
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
    })
)