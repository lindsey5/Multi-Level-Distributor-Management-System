import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { StockTransfer } from "./stock-transfer.type";

export interface DistributorNotification {
    _id: string;
    distributor_id: string;
    transfer_id: string;
    stockTransfer: StockTransfer;
    message: string;
    status: 'read' | 'unread';
    createdAt: string;
}

export interface GetDistributorNotificationsResponse extends PaginationResponse{
    notifications: DistributorNotification[];
    unread: number;
}

export interface GetDistributorNotificationsParams extends PaginationParams {}