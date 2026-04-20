import { useQuery } from "@tanstack/react-query";
import { distributorService } from "../../services/distributorService";

export const useGetBalance = () => (
    useQuery<{ wallet_balance: number }, Error>({
        queryKey: ['balance'],
        queryFn: () => distributorService.getDistributorBalance(),
        refetchOnWindowFocus: false,
    })
)