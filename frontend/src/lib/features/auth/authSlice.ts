import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Distributor } from "../../../types/distributor.type";

interface DistributorAuthState {
    distributor: Distributor | null;
    refreshToken: string | null;
    accessToken: string | null;
}

const initialState: DistributorAuthState = {
    distributor: null,
    refreshToken: null,
    accessToken: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setDistributor(state, action: PayloadAction<Distributor>) {
            state.distributor = action.payload;
        },

        setAuth(state, action: PayloadAction<{ accessToken: string, refreshToken: string}>) {
            state.refreshToken = action.payload.refreshToken;
            state.accessToken = action.payload.accessToken
        },

        logout(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.distributor= null;
        },
    },
});

export const { setDistributor, logout, setAuth } = authSlice.actions;

const authReducer = authSlice.reducer

export default authReducer;