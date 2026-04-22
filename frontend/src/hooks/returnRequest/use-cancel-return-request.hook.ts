import { useMutation } from "@tanstack/react-query";
import { returnRequestService } from "../../services/returnRequestService";

export const useCancelReturnRequest = () => {
    return useMutation({
        mutationFn: ({ id }: { id : string}) =>
            returnRequestService.cancelReturnRequest(id)
    });
};