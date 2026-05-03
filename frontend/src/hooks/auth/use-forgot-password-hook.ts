import { useMutation } from "@tanstack/react-query";
import { authService } from   "../../services/authService";

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: async (email: string ) => {
            return await authService.forgotPassword(email); 
        },
    });
}