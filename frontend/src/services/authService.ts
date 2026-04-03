import { type AdminAuthResponse, type LoginPayload } from "../types/auth.type";
import { adminApi, HttpMethod } from "../lib/api/apiAxios";

export const authService = {
    adminLogin: (data: LoginPayload): Promise<AdminAuthResponse> =>
        adminApi<AdminAuthResponse>("auth/admin/login", {
            method: HttpMethod.POST,
            data,
        }),

    adminRefreshAccessToken: (refreshToken : string): Promise<AdminAuthResponse> => 
        adminApi<AdminAuthResponse>("auth/admin/refreshToken", {
            method: HttpMethod.POST,
            data: { refreshToken }
        }),
};