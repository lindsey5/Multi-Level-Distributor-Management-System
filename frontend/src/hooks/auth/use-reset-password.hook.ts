import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/authService";

interface ResetPasswordPayload {
    newPassword: string;
    token: string;
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn: ({ token, newPassword } : ResetPasswordPayload) =>
            authService.resetPassword(newPassword, token),
    });
};