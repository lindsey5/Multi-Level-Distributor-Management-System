import { useMutation } from "@tanstack/react-query";
import type { CreateStockOrderPayload } from "../../types/stock-order.type";
import { stockOrderService } from "../../services/stockOrderService";

export const useCreateStockOrder = () => {
    return useMutation({
        mutationFn: ({ items } : { items: CreateStockOrderPayload []}) =>
            stockOrderService.createStockOrder(items)
    });
};