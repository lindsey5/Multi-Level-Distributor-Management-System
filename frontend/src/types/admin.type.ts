export interface Admin {
    _id: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    wallet_balance: number;
    createdAt: Date;
}