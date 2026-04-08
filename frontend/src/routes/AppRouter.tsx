import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import { ProtectedRoute } from "../components/ProtectedRoute";
import PageContainer from "../components/ui/PageContainer";
import DashboardLayout from "../pages/DashboardLayout";
import Inventory from "../pages/Dashboard/Inventory";
import StockTransferSocketContextProvider from "../contexts/StockTransferContext";
import Sales from "../pages/Dashboard/Sales";
import TransferLogs from "../pages/Dashboard/TransferLogs";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Dashboard/Profile";
import ProfileLayout from "../pages/ProfileLayout";

const router = createBrowserRouter([ 
    {
        index: true,
        Component: () => <Login />
    },
    {
        path: '/distributor',
        Component: () => (
            <StockTransferSocketContextProvider>
                <ProtectedRoute requireAuthentication>
                    <DashboardLayout />
                </ProtectedRoute>
            </StockTransferSocketContextProvider>
        ),
        children: [
            {
                index: true,
                Component: () => (
                    <PageContainer title="Dashboard">
                        <Dashboard />
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
            },
            {
                path: 'sales',
                Component: () => (
                    <PageContainer title="Sales" description="Overview of all sales">
                        <Sales />
                    </PageContainer>
                )
            },
            {
                path: 'transfer-logs',
                Component: () => (
                    <PageContainer
                        title="Stock Transfer History"
                        description="View all stock transfer records"
                    >
                        <TransferLogs />
                    </PageContainer>
                )
            },
            {
                path: 'profile',
                Component: () => (
                    <PageContainer
                        title="Profile"
                        description="Manage your account"
                    >
                        <ProfileLayout />
                    </PageContainer>
                ),
                children: [
                    {
                        index: true,
                        Component: () => <Profile />
                    }
                ]
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}