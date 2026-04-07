import { Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "../utils/helpers";
import { LayoutDashboard, Archive, FileText, Users, Repeat, BarChart } from "lucide-react";
import type { MenuItem } from "../types/menu.type";
import DistributorSidebar from "../components/distributor/DistributorSidebar";

export const MenuItems: MenuItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/distributor" },
    { label: "Sales", icon: <BarChart size={18} />, path: "/distributor/sales" },
    { label: "Inventory", icon: <Archive size={18} />, path: "/distributor/inventory" },
    { label: "Commission Logs", icon: <FileText size={18} />, path: "/distributor/commission-logs" },
    { label: "Transfer History", icon: <Repeat size={18} />, path: "/distributor/transfer-logs" },
    { label: "Recruit", icon: <Users size={18} />, path: "/distributor/recruit" },
];

export default function DistributorLayout () {
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