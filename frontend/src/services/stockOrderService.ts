import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { CreateStockOrderPayload, CreateStockOrderResponse } from "../types/stock-order.type";

export const stockOrderService = {
    createStockOrder: (items: CreateStockOrderPayload[]) =>
        apiAxios<CreateStockOrderResponse>("stock-orders", {
            method: HttpMethod.POST,
            data: { 
                items
            },
        }),
}