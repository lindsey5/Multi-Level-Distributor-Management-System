import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Admin } from "../../../types/admin.type";

interface AdminAuthState {
    admin: Admin| null;
    refreshToken: string | null;
    accessToken: string | null;
}

const initialState: AdminAuthState = {
    admin: null,
    refreshToken: null,
    accessToken: null
};

const adminAuthSlice = createSlice({
    name: 'auth-admin',
    initialState,
    reducers: {
        setAdmin(state, action: PayloadAction<Admin>) {
            state.admin = action.payload;
        },

        setAdminAuth(state, action: PayloadAction<{ accessToken: string, refreshToken: string}>) {
            state.refreshToken = action.payload.refreshToken;
            state.accessToken = action.payload.accessToken
        },

        adminLogout(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.admin= null
        },
    },
});

export const { setAdmin, adminLogout, setAdminAuth } = adminAuthSlice.actions;

const adminAuthReducer = adminAuthSlice.reducer

export default adminAuthReducer;