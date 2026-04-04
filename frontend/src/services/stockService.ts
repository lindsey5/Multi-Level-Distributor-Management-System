import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import { type GetStocksParams, type GetStocksResponse } from "../types/stock.type";

export const stockService = {
    getStocks: (params: GetStocksParams): Promise<GetStocksResponse> => (
        apiAxios<GetStocksResponse>(`stocks`,{
            method: HttpMethod.GET,
            params
        })
    ),
};