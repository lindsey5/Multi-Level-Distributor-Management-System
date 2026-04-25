import { Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "../utils/helpers";
import { LayoutDashboard, Archive, Repeat, User, BarChartBig, Undo2, PackagePlus, Package, Star } from "lucide-react";
import type { MenuItem } from "../types/menu.type";
import DistributorSidebar from "../components/distributor/DistributorSidebar";

export const MenuItems: MenuItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/distributor" },
    { label: "Sales", icon: <BarChartBig size={18} />, path: "/distributor/sales" },
    { label: "Inventory", icon: <Archive size={18} />, path: "/distributor/inventory" },
    { label: "Your Orders", icon: <Package size={18} />, path: "/distributor/orders" },
    { label: "Order Stock", icon: <PackagePlus size={18} />, path: "/distributor/stock-order" },
    { label: "Distribution History", icon: <Repeat size={18} />, path: "/distributor/distribution-history" },
    { label: "Return History", icon: <Undo2 size={18} />, path: "/distributor/return-history" },
    { label: "Sponsored Products", icon: <Star size={18} />, path: "/distributor/sponsored-items" },
    { label: "Profile", icon: <User size={18} />, path: "/distributor/profile" },
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