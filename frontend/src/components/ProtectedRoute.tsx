import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { type RootState } from '../lib/features/store';
import { useSelector } from 'react-redux';

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
    const auth = useSelector((state : RootState) => state.auth);
    
    const isAuth = !!(auth.accessToken && auth.distributor);

    if (requireAuthentication && !isAuth) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};