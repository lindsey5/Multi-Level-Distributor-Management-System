import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { store } from "../../lib/features/store";
import { useNavigate } from "react-router-dom";
import type { LoginPayload } from "../../types/auth.type";
import { setAuth } from "../../lib/features/auth/authSlice";

export const useLogin = () => {
    const navigate = useNavigate();
    
    return useMutation({
        mutationFn: ({ email, password }: LoginPayload) =>
            authService.login({ email, password }),

        onSuccess: (data) => {
            const distributor = data.distributor;
            const { refreshToken, accessToken } = data.token;

            store.dispatch(setAuth({ refreshToken, accessToken, distributor }));
            navigate('/distributor');
        },
    });
};