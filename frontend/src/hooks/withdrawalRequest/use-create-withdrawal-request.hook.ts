import { useMutation } from "@tanstack/react-query";
import { withdrawalRequestService } from "../../services/withdrawalRequestService";
import type { CreateWithdrawalRequestPayload } from "../../types/withdrawalRequest.type";

export const useCreateWithdrawalRequest = () => {
    return useMutation({
        mutationFn: (data : CreateWithdrawalRequestPayload) =>
            withdrawalRequestService.createWithdrawalRequest(data)
    });
};