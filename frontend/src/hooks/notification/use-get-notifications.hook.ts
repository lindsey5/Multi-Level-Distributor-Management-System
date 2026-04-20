import { useQuery } from "@tanstack/react-query";
import type { GetDistributorNotificationsParams, GetDistributorNotificationsResponse } from "../../types/notification.type";
import { notificationService } from "../../services/notificationService";

export const useGetNotifications = (params : GetDistributorNotificationsParams) => (
    useQuery<GetDistributorNotificationsResponse, Error>({
        queryKey: ['notifications', params],
        queryFn: () => notificationService.getNotifications(params),
        refetchOnWindowFocus: false,
    })
)