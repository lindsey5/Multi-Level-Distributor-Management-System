import type { RootState } from "../store";

export const isAuthenticated = (state: RootState) => !!(state.auth.distributor && state.auth.accessToken);