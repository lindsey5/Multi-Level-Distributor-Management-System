import { useMutation } from "@tanstack/react-query";
import { stockTransferLogService } from "../../services/stockTransferService";

export const useUpdateStockTransferStatus = () => {
    return useMutation({
        mutationFn: ({ id }: { id : string }) =>
            stockTransferLogService.markStockTransferLogAsReceived(id)
    });
};