import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { ReturnRequest } from "./returnRequest.type";
import type { DistributorSale } from "./sale.type";
import type { StockOrder } from "./stock-order.type";
import type { StockTransferLog } from "./stock-transfer.type";

export interface DistributorNotification {
    _id: string;
    distributor_id: string;
    transfer_id?: string | null;
    stockTransfer?: StockTransferLog | null;
    return_id?: string | null;
    returnRequest?: ReturnRequest | null;
    sale_ids?: string[] | null;
    sales?: DistributorSale[] | null;
    stock_order_id: string;
    stockOrder: StockOrder;
    message: string;
    status: 'read' | 'unread';
    createdAt: string;
}

export interface GetDistributorNotificationsResponse extends PaginationResponse{
    notifications: DistributorNotification[];
    unread: number;
}

export interface GetDistributorNotificationsParams extends PaginationParams {}