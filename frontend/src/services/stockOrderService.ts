import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import { type GetStockOrdersResponse, type CreateStockOrderPayload, type CreateStockOrderResponse, type GetStockOrdersParams, type GetStockOrderResponse } from "../types/stock-order.type";

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
        }),
    getStockOrderById: (id : string) => 
        apiAxios<GetStockOrderResponse>(`stock-orders/${id}`, {
            method: HttpMethod.GET,
        }),

    updateStockOrder: (id : string, status : string) => 
        apiAxios<GetStockOrderResponse>(`stock-orders/${id}`, {
            method: HttpMethod.PATCH,
            data: { status }
        })
}