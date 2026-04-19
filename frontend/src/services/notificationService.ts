import { apiAxios, HttpMethod } from "../lib/api/apiAxios";
import type { GetDistributorNotificationsParams, GetDistributorNotificationsResponse } from "../types/notification.type";

export const notificationService = {
    getNotifications: (params : GetDistributorNotificationsParams): Promise<GetDistributorNotificationsResponse> =>
        apiAxios<GetDistributorNotificationsResponse>("distributor-notifications", {
            method: HttpMethod.GET,
            params
        }),
    
    readNotification: (id: string) : Promise<{ message: string}> => (
        apiAxios<{ message: string}>(`distributor-notifications/${id}`, {
            method: HttpMethod.PATCH,
        })
    ),

    readAllNotifications: () : Promise<{ message: string}> => (
        apiAxios<{ message: string}>('distributor-notifications', {
            method: HttpMethod.PATCH,
        })
    )
};