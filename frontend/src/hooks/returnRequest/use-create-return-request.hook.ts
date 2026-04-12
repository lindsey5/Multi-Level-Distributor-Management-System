import { useMutation } from "@tanstack/react-query";
import type { CreateReturnRequestPayload } from "../../types/returnRequest.type";
import { returnRequestService } from "../../services/returnRequestService";

export const useCreateReturnRequest = () => {
    return useMutation({
        mutationFn: ({ data }: { data : CreateReturnRequestPayload}) =>
            returnRequestService.createReturnRequest(data)
    });
};