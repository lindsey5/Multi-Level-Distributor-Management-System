import { useQuery } from "@tanstack/react-query";
import { distributorService } from "../../services/distributorService";
import type { GetDownlineDistributorsResponse } from "../../types/distributor.type";

export const useGetDownlineDistributors = () => (
    useQuery<GetDownlineDistributorsResponse, Error>({
        queryKey: ['distributors/downline'],
        queryFn: () => distributorService.getDownlineDistributors(),
        refetchOnWindowFocus: false,
    })
)