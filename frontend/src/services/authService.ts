import { type AuthResponse, type LoginPayload } from "../types/auth.type";
import { apiAxios, HttpMethod } from "../lib/api/apiAxios";

export const authService = {
    login: (data: LoginPayload) =>
        apiAxios<AuthResponse>("auth/login", {
            method: HttpMethod.POST,
            data,
        }),

    refreshAccessToken: (refreshToken : string) => 
        apiAxios<AuthResponse>("auth/refreshToken", {
            method: HttpMethod.POST,
            data: { refreshToken }
        }),

    changePassword: (currentPassword: string, newPassword: string) => 
        apiAxios<{ message?: string }>("auth/change-password", {
            method: HttpMethod.PATCH,
            data: { currentPassword, newPassword }
        }),

    forgotPassword: (email: string) =>
        apiAxios<{ message?: string }>("auth/forgot-password", {
            method: HttpMethod.POST,
            data: { email},
        }),

    resetPassword: (newPassword: string, resetToken: string) =>
        apiAxios<{ message?: string }>("auth/reset-password", {
            method: HttpMethod.POST,
            data: { 
                newPassword,
                resetToken
            },
        }),
};