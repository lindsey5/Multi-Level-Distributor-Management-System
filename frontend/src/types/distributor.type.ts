
export interface Distributor {
    _id: string;
    parent_distributor_id?: string;
    parent_distributor: Distributor;
    distributor_name: string;
    commission_rate: number;
    wallet_balance: number;
    email: string;
    password: string;
    status: "active" | "deleted";
    total_stocks?: number;
    createdAt: Date;
}