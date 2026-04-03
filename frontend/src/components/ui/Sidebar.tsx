import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { MenuItem } from "../../types/menu.type";

interface SidebarProps {
    items: MenuItem[];
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => void;
}

export default function Sidebar ({ items, collapsed, setCollapsed, logout } : SidebarProps) {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <aside
            className={`z-20 fixed left-0 inset-y-0 bg-white border-r border-gray-300 hidden lg:flex flex-col transition-all duration-300
                ${collapsed ? "w-20" : "w-72"}
            `}
        >
            {/* Top */}
            <div className="flex items-center justify-between p-5">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                            <img src="/logo.png" alt="logo" className="w-8 h-8" />
                        </div>
                
                        <span className="text-sm font-semibold text-gray-900 leading-tight">
                        Zhiyuan <br /> Enterprice Group Inc.
                        </span>
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                >
                    {collapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3 py-6 flex flex-col gap-2">
                {items.map((item) => (
                <Link
                    key={item.label}
                    to={item.path}
                    className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                    ${
                        pathname === item.path
                        ? "bg-gray-900 text-white"
                        : "text-gray-900 hover:bg-gray-200"
                    }
                    `}
                >
                    {item.icon}
                    {!collapsed && <span>{item.label}</span>}
                </Link>
                ))}
            </nav>
            <div className="px-3 pb-6">
                <button
                    className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                    text-red-600 hover:bg-red-100 transition"
                    onClick={logout}
                >
                <LogOut size={18} />
                {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    )
}