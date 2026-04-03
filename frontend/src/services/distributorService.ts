import { type AdminAuthResponse } from "../types/auth.type";
import { adminApi, HttpMethod } from "../lib/api/apiAxios";
import type { GetDistributorsResponse, CreatDistributorDTO, GetDistributorsParams } from '../types/distributor.type';

export const distributorService = {
    createDistributor: (data: CreatDistributorDTO, accessToken: string): Promise<AdminAuthResponse> =>
        adminApi<AdminAuthResponse>("/distributors", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            method: HttpMethod.POST,
            data,
        }),

    getDistributors: (params: GetDistributorsParams, accessToken: string): Promise<GetDistributorsResponse> => (
        adminApi<GetDistributorsResponse>("/distributors",{
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            method: HttpMethod.GET,
            params
        })
    )
};