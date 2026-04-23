import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetStockOrdersResponse, CreateStockOrderPayload, CreateStockOrderResponse, GetStockOrdersParams } from "../types/stock-order.type";

export const stockOrderService = {
    createStockOrder: (items: CreateStockOrderPayload[]) =>
        apiAxios<CreateStockOrderResponse>("stock-orders", {
            method: HttpMethod.POST,
            data: { 
                items
            },
        }),
    getStockOrders: (params: GetStockOrdersParams) => 
        apiAxios<GetStockOrdersResponse>("stock-orders", {
            method: HttpMethod.GET,
            params
        })
}