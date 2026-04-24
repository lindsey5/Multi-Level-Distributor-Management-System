import { useMutation } from "@tanstack/react-query";
import { stockOrderService } from "../../services/stockOrderService";

export const useUpdateStockOrder = () => {
    return useMutation({
        mutationFn: (payload : { id: string, status: string}) =>
            stockOrderService.updateStockOrder(payload.id, payload.status)
    });
};