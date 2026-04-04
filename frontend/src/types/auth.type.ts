import type { Distributor } from "./distributor.type"

export interface AuthResponse { 
    distributor: Distributor,
    token: {
        accessToken: string
        refreshToken: string
    }
}

export interface LoginPayload {
  email: string;
  password: string;
}