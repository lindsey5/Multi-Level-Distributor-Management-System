import axios from 'axios';
import { authService } from '../../services/authService';
import { store } from '../features/store';
import { adminLogout, setAdmin, setAdminAuth } from '../features/adminAuth/adminAuthSlice';

const API_URL = import.meta.env.VITE_API_URL;

const adminAxiosClient = axios.create({
    baseURL: `${API_URL}/api/`,
    timeout: 10000,
});

adminAxiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const state = store.getState();
        const refreshToken = state.adminAuth.refreshToken;
        if (status === 401 && !originalRequest._retry && refreshToken) {
            originalRequest._retry = true;

            try {
                const data = await authService.adminRefreshAccessToken(refreshToken);
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.token;
                
                store.dispatch(setAdminAuth({ accessToken: newAccessToken, refreshToken: newRefreshToken }))

                store.dispatch(setAdmin(data.admin))

                originalRequest.headers.Authorization = `Bearer ${data.token.accessToken}`;

                return adminAxiosClient(originalRequest);
            } catch (err) {
                store.dispatch(adminLogout())
                return Promise.reject(err);
            }
        }
        const message = error.response?.data?.message || error.response?.data?.error || error.message;
        return Promise.reject(new Error(message));
    }
);

export default adminAxiosClient;