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
import WalletBalance from "../pages/WalletBalanceLayout";
import Withdraw from "../pages/Dashboard/Withdraw";
import CommissionLogs from "../pages/Dashboard/CommissionLogs";
import UserNotificationSocketContextProvider from "../contexts/UserNotificationSocket";
import ChangePassword from "../pages/Dashboard/ChangePassword";

const router = createBrowserRouter([ 
    {
        index: true,
        Component: () => <Login />
    },
    {
        path: '/distributor',
        Component: () => (
            <StockTransferSocketContextProvider>
                <UserNotificationSocketContextProvider>
                    <ProtectedRoute requireAuthentication>
                        <DashboardLayout />
                    </ProtectedRoute>
                </UserNotificationSocketContextProvider>
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
                    <PageContainer title="Your Sales" description="View your sales history">
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
                    },
                    {
                        path: 'wallet-balance',
                        Component: () => <WalletBalance />,
                        children: [
                            {
                                path: 'withdraw',
                                Component: () => <Withdraw />
                            },
                            {
                                path: 'commissions',
                                Component: () => <CommissionLogs />
                            }
                        ]
                    },
                    {
                        path: 'change-password',
                        Component: () => <ChangePassword />
                    }
                ]
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}