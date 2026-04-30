import type { Distributor } from "./distributor.type";
import type { PaginationParams, PaginationResponse } from "./pagination.type";

export interface WithdrawalRequestMethod {
    type: "cash" | "card" | "gcash" | "maya";
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

export interface CreateWithdrawalRequestResponse {
    withdrawalRequest: WithdrawalRequest;
    message?: string;
}

export interface UpdateWithdrawalRequestPayload {
    id: string;
    status: string;
}

export interface UpdateWithdrawalRequestResponse {
    message?: string;
    withdrawalRequest: WithdrawalRequest;
}

export interface GetWithdrawalRequestsParams extends PaginationParams {
    startDate?: string;
    endDate?: string;
    status?: string;
}

export interface GetWithdrawalRequestsResponse extends PaginationResponse {
    withdrawalRequests: WithdrawalRequest[]
}