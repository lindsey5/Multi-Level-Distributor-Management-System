import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import { ProtectedRoute } from "../components/ProtectedRoute";
import PageContainer from "../components/ui/PageContainer";
import DistributorLayout from "../pages/DistributorLayout";
import Inventory from "../pages/Dashboard/Inventory";

const router = createBrowserRouter([ 
    {
        index: true,
        Component: () => <Login />
    },
    {
        path: '/distributor',
        Component: () => (
            <ProtectedRoute requireAuthentication>
                <DistributorLayout />
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
                path: 'inventory',
                Component: () => (
                    <PageContainer title="Inventory" description="Monitor your current stock levels">
                        <Inventory />
                    </PageContainer>
                )
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}