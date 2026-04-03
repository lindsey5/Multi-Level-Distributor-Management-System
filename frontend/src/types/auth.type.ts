import type { Admin } from "./admin.type"

export interface AuthResponse { 
    token: {
        accessToken: string
        refreshToken: string
    }
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AdminAuthResponse extends AuthResponse {
    admin: Admin
}