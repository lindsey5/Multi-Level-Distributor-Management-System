import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { isAuthenticated } from '../lib/features/auth/authSelectors';
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
    const isAuth = useSelector(isAuthenticated);

    if (requireAuthentication && !isAuth) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};