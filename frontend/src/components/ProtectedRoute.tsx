import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

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
    const rootString = localStorage.getItem("persist:root");
    let root = null;

    if (rootString) root = JSON.parse(rootString);

    const authString = root.auth;
    let auth = null;

    if(authString) auth = JSON.parse(authString)

    const isAuth = !!(auth.accessToken && auth.distributor);


    if (requireAuthentication && !isAuth) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};