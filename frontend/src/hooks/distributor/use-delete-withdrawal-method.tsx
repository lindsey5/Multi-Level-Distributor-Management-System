import { useMutation } from "@tanstack/react-query";
import { distributorService } from "../../services/distributorService";
import { store } from "../../lib/features/store";
import { setWithdrawalMethod } from "../../lib/features/auth/authSlice";

export const useDeleteWithdrawalMethod = () => {
    return useMutation({
        mutationFn: (id: string) =>
            distributorService.deleteWithdrawalMethod(id),
        onSuccess: (data) => {
            const state = store.getState();
            const methods = state.auth.distributor?.withdrawal_methods || [];
            store.dispatch(setWithdrawalMethod({
                methods: methods.filter(method => method._id !== data.id)
            }));
        }
    });
};