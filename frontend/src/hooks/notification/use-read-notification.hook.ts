import { useMutation } from "@tanstack/react-query";
import { notificationService } from "../../services/notificationService";

export const useReadNotification = () => {

    return useMutation({
        mutationFn: ({ id }: { id: string}) =>
            notificationService.readNotification(id)
    });
};

export const useReadAllNotifications = () => {
    return useMutation({
        mutationFn: () => notificationService.readAllNotifications()
    })
}