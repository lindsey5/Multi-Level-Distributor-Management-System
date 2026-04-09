import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/authService";

interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: ({ currentPassword, newPassword } : ChangePasswordPayload) =>
            authService.changePassword(currentPassword, newPassword),
    });
};