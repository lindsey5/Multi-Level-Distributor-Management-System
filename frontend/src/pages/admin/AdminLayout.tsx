import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useState } from "react";
import { cn } from "../../utils/helpers";
import { LayoutDashboard, Users, BarChart3, FileText, Package } from "lucide-react";
import AdminHeaderMenu from "../../components/admin/AdminHeaderMenu";
import type { MenuItem } from "../../types/menu.type";

export const AdminMenuItems : MenuItem[] = [
    { label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin" },
    { label: "Distributors", icon: <Users size={18} />, path: "/admin/distributors" },
    { label: "Distributor Sales", icon: <BarChart3 size={18} />, path: "/admin/sales" },
    { label: "Reports", icon: <FileText size={18} />, path: "/admin/reports" },
    { label: "Inventory", icon: <Package size={18} />, path: "/admin/inventory" },
];

export default function AdminLayout () {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={cn(
            "min-h-screen",
            collapsed ? "lg:pl-20" : "lg:pl-72"
        )}> 
            <AdminHeaderMenu />
            <AdminSidebar 
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />
            <Outlet />
        </div>
    )
}