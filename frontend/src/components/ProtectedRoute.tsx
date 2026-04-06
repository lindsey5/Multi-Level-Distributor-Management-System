import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { store } from '../lib/features/store';

type ProtectedRouteProps = {
    children: ReactNode;
    requireAuthentication: boolean;
    redirectTo?: string;
};

export const ProtectedRoute = ({
    children,
    requireAuthentication,
    redirectTo = '/',
}: ProtectedRouteProps) => {
    const auth = store.getState().auth;
    const isAuth = !!(auth.accessToken && auth.distributor);

    if (requireAuthentication && !isAuth) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};