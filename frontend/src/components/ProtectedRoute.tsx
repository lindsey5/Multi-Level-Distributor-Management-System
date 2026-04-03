import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { isAdminAuthenticated } from '../lib/features/adminAuth/adminAuthSelectors';
import { useSelector } from 'react-redux';

type ProtectedRouteProps = {
    children: ReactNode;
    requireAuthentication?: 'Admin' | 'Distributor';
    redirectTo?: string;
};

export const ProtectedRoute = ({
    children,
    requireAuthentication = 'Admin',
    redirectTo = '/',
}: ProtectedRouteProps) => {

    const isAuth = useSelector(isAdminAuthenticated);

    if (requireAuthentication && !isAuth) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};