import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Distributor, WithdrawalMethod } from "../../../types/distributor.type";

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
        setAuth(state, action: PayloadAction<{ accessToken: string, refreshToken: string, distributor: Distributor }>) {
            state.distributor = action.payload.distributor;
            state.refreshToken = action.payload.refreshToken;
            state.accessToken = action.payload.accessToken
        },

        setDistributor(state, action: PayloadAction<{ distributor: Distributor }>) {
            state.distributor = action.payload.distributor;
        },

        setWithdrawalMethod(state, action: PayloadAction<{ methods: WithdrawalMethod[]}>) {
            if(state.distributor){
                state.distributor.withdrawal_methods = action.payload.methods
            }
        },

        logout(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.distributor= null;
        },
    },
});

export const { logout, setAuth, setDistributor, setWithdrawalMethod } = authSlice.actions;

const authReducer = authSlice.reducer

export default authReducer;