
export interface Distributor {
    _id: string;
    distributor_id: string;
    parent_distributor_id?: string;
    parent_distributor: Distributor;
    distributor_name: string;
    commission_rate: number;
    wallet_balance: number;
    email: string;
    total_stocks?: number;
    createdAt: Date;
}

export interface UpdateDistributorPayload {
    email: string;
    distributor_name: string;
}

export interface UpdateDistributorResponse {
    message?: string;
    distributor: Distributor
}