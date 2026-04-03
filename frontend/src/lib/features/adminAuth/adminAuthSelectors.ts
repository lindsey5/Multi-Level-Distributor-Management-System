import type { RootState } from "../store";

export const isAdminAuthenticated = (state: RootState) => !!(state.adminAuth.admin && state.adminAuth.accessToken);