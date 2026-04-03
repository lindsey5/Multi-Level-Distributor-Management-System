import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import AdminLayout from "../pages/admin/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Distributors from "../pages/admin/Dashboard/Distributors";
import PageContainer from "../components/ui/PageContainer";

const router = createBrowserRouter([ 
    {
        index: true,
        Component: () => <Login />
    },
    {
        path: '/admin',
        Component: () => (
            <ProtectedRoute requireAuthentication="Admin">
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                Component: () => (
                    <PageContainer title="Dashboard">
                        <></>
                    </PageContainer>
                )
            },
            {
                path: 'distributors',
                Component: () => (
                    <PageContainer title="Distributors" className="max-h-screen">
                        <Distributors />
                    </PageContainer>
                )
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}