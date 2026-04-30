import { useMutation } from "@tanstack/react-query";
import { withdrawalRequestService } from "../../services/withdrawalRequestService";
import type { UpdateWithdrawalRequestPayload } from "../../types/withdrawalRequest.type";

export const useUpdateWithdrawalRequestStatus = () => {
    return useMutation({
        mutationFn: (payload : UpdateWithdrawalRequestPayload) =>
            withdrawalRequestService.updateWithdrawalRequestStatus(payload)
    });
};