import { useMutation } from "@tanstack/react-query";
import type { CreatDistributorDTO } from "../../types/distributor.type";
import { distributorService } from "../../services/distributorService";
import { store } from "../../lib/features/store";

export const useCreateDistributor = () => {
    const state = store.getState();
    const accessToken = state.adminAuth.accessToken

    return useMutation({
        mutationFn: (data : CreatDistributorDTO) =>
            distributorService.createDistributor(data, accessToken || ""),
    });
};