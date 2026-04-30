
export interface Distributor {
    _id: string;
    distributor_id: string;
    parent_distributor_id?: string;
    parent_distributor: Distributor;
    distributor_name: string;
    email: string;
    commission_rate: number;
    wallet_balance: number;
    withdrawal_methods: WithdrawalMethod[];
    createdAt: string;
}

export interface WithdrawalMethod {
    _id: string;
    type: "card" | "gcash" | "maya";
    account_name: string;
    account_number: string;
    bank_name?: string;
    is_default: boolean;
    createdAt?: string;
}

export interface UpdateDistributorPayload {
    email: string;
    distributor_name: string;
    withdrawal_methods?: WithdrawalMethod[];
}

export interface UpdateDistributorResponse {
    message?: string;
    distributor: Distributor
}

export interface AddWithdrawalMethodPayload {
    type: "bank" | "gcash" | "maya";
    account_name: string;
    account_number: string;
    bank_name?: string;
    is_default: boolean;
}

export interface AddWithdrawalMethodResponse {
    message?: string;
    withdrawalMethod: WithdrawalMethod;
}