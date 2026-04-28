import type { Distributor } from "./distributor.type";

export interface WithdrawalRequestMethod {
    type: "cash" | "bank" | "gcash" | "maya";
    account_name?: string;
    account_number?: string;
    bank_name?: string;
}

export interface WithdrawalRequest {
    _id: string;
    distributor_id: string;
    distributor: Distributor;
    withdrawal_method: WithdrawalRequestMethod;
    amount: number;
    status: "pending" | "approved" | "completed" | "rejected" | "cancelled";
    createdAt: string;
}

export interface CreateWithdrawalRequestPayload {
    amount: number;
    withdrawal_method: WithdrawalRequestMethod;
}