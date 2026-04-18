import type { Distributor } from "./distributor.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { Variant } from "./variant.type";

export interface Sender {
    firstname: string;
    lastname: string;
    email: string;
    role_id: string;
    role: string;
    createdAt: Date;
}

export interface StockTransferLog {
    _id: string;
    items: StockTransferItem[];
    sender_id: string | null;
    receiver_id: string;
    sender?: Sender;
    receiver?: Distributor;
    status: 'pending'| 'approved'| 'processing' | 'delivered' | 'received' |  'cancelled' | 'rejected'
    createdAt: string;
}

export interface StockTransferItem {
    _id: string;
    variant: Variant;
    transfer_id: string;
    quantity: number;
    variant_id: string;
}

export interface GetStockTransferLogsResponse extends PaginationResponse {
    stockTransferLogs: StockTransferLog[]
}

export interface GetStockTransferLogsParams extends PaginationParams {
    search?: string;
    startDate: string;
    endDate: string;
    status: string;
}

export interface UpdateStockTransferLogResponse {
    message: string;
    stockTransfer: StockTransferLog
}