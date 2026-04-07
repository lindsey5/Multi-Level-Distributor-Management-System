import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import { ProtectedRoute } from "../components/ProtectedRoute";
import PageContainer from "../components/ui/PageContainer";
import DistributorLayout from "../pages/DistributorLayout";
import Inventory from "../pages/Dashboard/Inventory";
import StockTransferSocketContextProvider from "../contexts/StockTransferContext";
import Sales from "../pages/Dashboard/Sales";
import TransferLogs from "../pages/Dashboard/TransferLogs";

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
                    <DistributorLayout />
                </ProtectedRoute>
            </StockTransferSocketContextProvider>
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
                        description="View all stock transfer records, including transferred items, and quantities"
                    >
                        <TransferLogs />
                    </PageContainer>
                )
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}