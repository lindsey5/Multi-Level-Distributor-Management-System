import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { setAdmin, setAdminAuth } from "../../lib/features/adminAuth/adminAuthSlice";
import { store } from "../../lib/features/store";
import { useNavigate } from "react-router-dom";
import type { LoginPayload } from "../../types/auth.type";

export const useAdminLogin = () => {
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: ({ email, password }: LoginPayload) =>
            authService.adminLogin({ email, password }),

        onSuccess: (data) => {
            const { refreshToken, accessToken } = data.token;

            store.dispatch(setAdminAuth({ refreshToken, accessToken }));
            store.dispatch(setAdmin(data.admin));
            navigate('/admin');
        },
    });
};