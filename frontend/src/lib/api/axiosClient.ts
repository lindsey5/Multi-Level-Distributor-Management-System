import axios from 'axios';
import { authService } from '../../services/authService';
import { store } from '../features/store';
import { logout, setAuth, setDistributor } from '../features/auth/authSlice';

const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
    baseURL: `${API_URL}/api/`,
    timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
    const auth = store.getState().auth;
    const accessToken = auth.accessToken;
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const state = store.getState();
        const refreshToken = state.auth.refreshToken;
        if (status === 401 && !originalRequest._retry && refreshToken) {
            originalRequest._retry = true;

            try {
                const data = await authService.refreshAccessToken(refreshToken);
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.token;

                store.dispatch(setAuth({ accessToken: newAccessToken, refreshToken: newRefreshToken }))

                store.dispatch(setDistributor(data.distributor))

                axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return axiosClient(originalRequest);
            } catch (err) {
                store.dispatch(logout())
                return Promise.reject(err);
            }
        }
        const message = error.response?.data?.message || error.response?.data?.error || error.message;
        return Promise.reject(new Error(message));
    }
);

export default axiosClient;