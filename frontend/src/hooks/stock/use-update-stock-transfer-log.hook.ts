import { useMutation } from "@tanstack/react-query";
import { stockTransferLogService } from "../../services/stockTransferService";

export const useUpdateStockTransferStatus = () => {
    return useMutation({
        mutationFn: ({ id, status }: { id : string, status: string }) =>
            stockTransferLogService.updateStockTransferLogStatus(id, status)
    });
};