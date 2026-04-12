import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { ReturnRequest } from "./returnRequest.type";
import type { StockTransferLog } from "./stock-transfer.type";

export interface DistributorNotification {
    _id: string;
    distributor_id: string;
    transfer_id?: string | null;
    stockTransfer?: StockTransferLog | null;
    return_id?: string | null;
    returnRequest?: ReturnRequest | null;
    message: string;
    status: 'read' | 'unread';
    createdAt: string;
}

export interface GetDistributorNotificationsResponse extends PaginationResponse{
    notifications: DistributorNotification[];
    unread: number;
}

export interface GetDistributorNotificationsParams extends PaginationParams {}