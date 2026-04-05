import type { Variant } from "./variant.type";

export interface StockTransfer {
    _id: string;
    items: StockTransferItem[];
    sender_id: string | null;
    receiver_id: string;
}

export interface StockTransferItem {
    _id: string;
    variant: Variant;
    transfer_id: string;
    quantity: number;
    variant_id: string;
}