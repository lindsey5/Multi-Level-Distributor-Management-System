import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import { ProtectedRoute } from "../components/ProtectedRoute";
import PageContainer from "../components/ui/PageContainer";
import DashboardLayout from "../pages/DashboardLayout";
import Inventory from "../pages/Dashboard/Inventory";
import Sales from "../pages/Dashboard/Sales";
import DistributionHistory from "../pages/Dashboard/DistributionHistory";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Dashboard/Profile";
import ProfileLayout from "../pages/ProfileLayout";
import WalletBalance from "../pages/WalletBalanceLayout";
import Withdraw from "../pages/Dashboard/Withdraw";
import CommissionLogs from "../pages/Dashboard/CommissionLogs";
import ChangePassword from "../pages/Dashboard/ChangePassword";
import ReturnHistory from "../pages/Dashboard/ReturnHistory";

const router = createBrowserRouter([ 
    {
        index: true,
        Component: () => <Login />
    },
    {
        path: '/distributor',
        Component: () => (
            <ProtectedRoute requireAuthentication>
                <DashboardLayout />
            </ProtectedRoute>
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
                path: 'distribution-history',
                Component: () => (
                    <PageContainer
                        title="Distribution History"
                        description="View and manage the complete history of your stock distributions"
                    >
                        <DistributionHistory />
                    </PageContainer>
                )
            },
            {
                path: 'return-history',
                Component: () => (
                    <PageContainer 
                        title="Return History"
                        description="Check the status of all your return requests"
                    >
                        <ReturnHistory />
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