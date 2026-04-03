import { useQuery } from "@tanstack/react-query";
import { store } from "../../lib/features/store";
import type { GetDistributorsResponse, GetDistributorsParams } from "../../types/distributor.type";
import { distributorService } from "../../services/distributorService";

export const useGetDistributors = (params : GetDistributorsParams) => {
    const state = store.getState();
    const accessToken = state.adminAuth.accessToken

    return useQuery<GetDistributorsResponse, Error>({
        queryKey: ['distributors', params],
        queryFn: () => distributorService.getDistributors(params, accessToken || ""),
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: false,
    })
    
}