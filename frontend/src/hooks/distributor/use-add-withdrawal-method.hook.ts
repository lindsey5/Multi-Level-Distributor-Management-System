import { useMutation } from "@tanstack/react-query";
import type { AddWithdrawalMethodPayload } from "../../types/distributor.type";
import { distributorService } from "../../services/distributorService";
import { store } from "../../lib/features/store";
import { setWithdrawalMethod } from "../../lib/features/auth/authSlice";

export const useAddWithdrawalMethod = () => {
    return useMutation({
        mutationFn: (data : AddWithdrawalMethodPayload) => distributorService.addWithdrawalMethod(data),
        onSuccess: (data) => {
            const state = store.getState();
            const methods = state.auth.distributor?.withdrawal_methods || [];
            const withdrawalMethod = data.withdrawalMethod;
            store.dispatch(setWithdrawalMethod({
                methods: [withdrawalMethod, ...methods]
            }));
        }
    });
};