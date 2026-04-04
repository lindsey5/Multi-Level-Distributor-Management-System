import { type AuthResponse, type LoginPayload } from "../types/auth.type";
import { apiAxios, HttpMethod } from "../lib/api/apiAxios";

export const authService = {
    login: (data: LoginPayload): Promise<AuthResponse> =>
        apiAxios<AuthResponse>("auth/login", {
            method: HttpMethod.POST,
            data,
        }),

    refreshAccessToken: (refreshToken : string): Promise<AuthResponse> => 
        apiAxios<AuthResponse>("auth/refreshToken", {
            method: HttpMethod.POST,
            data: { refreshToken }
        }),
};