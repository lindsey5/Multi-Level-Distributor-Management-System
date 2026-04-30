import type { PaginationParams, PaginationResponse } from "./pagination.type";
import type { ReturnRequest } from "./returnRequest.type";
import type { DistributorSale } from "./sale.type";
import type { SponsoredItem } from "./sponsored-item.type";
import type { StockOrder } from "./stock-order.type";
import type { StockTransferLog } from "./stock-transfer.type";
import type { WithdrawalRequest } from "./withdrawalRequest.type";

export interface DistributorNotification {
    _id: string;
    distributor_id: string;
    transfer_id?: string | null;
    stockTransfer?: StockTransferLog | null;
    return_id?: string | null;
    returnRequest?: ReturnRequest | null;
    sale_ids?: string[] | null;
    sales?: DistributorSale[] | null;
    stock_order_id?: string;
    stockOrder?: StockOrder;
    sponsored_id?: string;
    sponsoredItem: SponsoredItem;
    withdrawal_id?: string;
    withdrawalRequest: WithdrawalRequest;
    message: string;
    status: 'read' | 'unread';
    createdAt: string;
}

export interface GetDistributorNotificationsResponse extends PaginationResponse{
    notifications: DistributorNotification[];
    unread: number;
}

export interface GetDistributorNotificationsParams extends PaginationParams {}