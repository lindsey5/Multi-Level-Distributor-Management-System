import type { Variant } from "framer-motion";

export interface DistributorSale {
    _id: string;
    seller_id: string; 
    variant_id: string;
    variant?: Variant;
    quantity: number;
    total_amount: number;
    createdAt: string;
}

export interface CreateDistributorSalePayload {
    variant_id: string;
    quantity: number;
    total_amount: number;
}

export interface CreateDistributorSaleResponse {
    message: string;
    total_amount: number;
    distributorCommission: number;
    sales: DistributorSale[]
}