import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { 
    GetDownlineDistributorsResponse, 
    AddWithdrawalMethodPayload, 
    AddWithdrawalMethodResponse, 
    UpdateDistributorPayload, 
    UpdateDistributorResponse 
} from "../types/distributor.type";

export const distributorService = {
    updateDistributor: (data : UpdateDistributorPayload) => (
        apiAxios<UpdateDistributorResponse> ("distributors", {
            method: HttpMethod.PUT,
            data
        })
    ),

    getDistributorBalance: () =>
        apiAxios<{ wallet_balance: number }>("distributors/balance", {
            method: HttpMethod.GET,
        }),

    addWithdrawalMethod: (data : AddWithdrawalMethodPayload) => 
        apiAxios<AddWithdrawalMethodResponse>("distributors/withdrawal-method", {
            method: HttpMethod.POST,
            data
        }),
    
    deleteWithdrawalMethod: (id: string) => 
        apiAxios<{ message?: string; id: string}>(`distributors/withdrawal-method/${id}`, {
            method: HttpMethod.DELETE,
        }),

    getDownlineDistributors: () => 
        apiAxios<GetDownlineDistributorsResponse>('distributors/downline', {
            method: HttpMethod.GET
        })
};