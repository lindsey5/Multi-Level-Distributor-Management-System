import { useMutation } from "@tanstack/react-query";
import type { UpdateDistributorPayload } from "../../types/distributor.type";
import { distributorService } from "../../services/distributorService";
import { store } from "../../lib/features/store";
import { setDistributor } from "../../lib/features/auth/authSlice";

export const useUpdateDistributor = () => {
    return useMutation({
        mutationFn: (data : UpdateDistributorPayload) =>
            distributorService.updateDistributor(data),
        onSuccess: (data) => {
            const distributor = data.distributor;
            store.dispatch(setDistributor({ distributor }));
        },
    });
};