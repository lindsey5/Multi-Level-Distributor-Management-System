import { Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "../utils/helpers";
import { LayoutDashboard, Archive, Repeat, User, BarChartBig, Undo2, PackagePlus, Package, Star, Banknote, Network } from "lucide-react";
import type { MenuItem } from "../types/menu.type";
import DistributorSidebar from "../components/distributor/DistributorSidebar";

export const MenuItems: MenuItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/distributor", category: "Analytics" },
    { label: "Sales", icon: <BarChartBig size={18} />, path: "/distributor/sales", category: "Analytics" },

    { label: "Inventory", icon: <Archive size={18} />, path: "/distributor/inventory", category: "Inventory" },
    { label: "Order Stock", icon: <PackagePlus size={18} />, path: "/distributor/stock-order", category: "Inventory" },
    { label: "Your Orders", icon: <Package size={18} />, path: "/distributor/orders", category: "Inventory" },

    { label: "Sponsored Products", icon: <Star size={18} />, path: "/distributor/sponsored-items", category: "Sponsored Products" },

    { label: "Distribution History", icon: <Repeat size={18} />, path: "/distributor/distribution-history", category: "History" },
    { label: "Return History", icon: <Undo2 size={18} />, path: "/distributor/return-history", category: "History" },
    { label: "Withdrawal History", icon: <Banknote size={18} />, path: "/distributor/withdrawal-requests", category: "History" },

    { label: "Downline Distributors", icon: <Network size={18}/>, path: "/distributor/downline", category: "Account" },
    { label: "Profile", icon: <User size={18} />, path: "/distributor/profile", category: "Account" },
];

export default function DashboardLayout () {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={cn(
            "w-full min-h-screen relative",
            collapsed ? "lg:pl-20" : "lg:pl-72"
        )}> 
            <DistributorSidebar 
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <Outlet />
        </div>
    )
}