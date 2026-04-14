import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { MenuItem } from "../../types/menu.type";
import { cn } from "../../utils/helpers";
import SidebarTour from "./Tour/SidebarTour";
interface SidebarProps {
  items: MenuItem[];
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

export default function Sidebar({
    items,
    collapsed,
    setCollapsed,
    logout,
}: SidebarProps) {
    const location = useLocation();
    const pathname = location.pathname;

    return (
        <aside
            className={cn(
                "z-20 fixed left-0 inset-y-0 hidden lg:flex flex-col transition-all duration-300 py-3",
                "bg-white border-r border-gray-300",
                collapsed ? "w-20" : "w-72"
            )}
        >
            <SidebarTour />
            {/* Logo */}
            <div
                className={cn(
                "flex items-center h-16 px-5 border-b border-gray-100",
                collapsed ? "justify-center" : "justify-between"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-black">
                        <img
                            src="/logo.png"
                            alt="logo"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {!collapsed && (
                        <div>
                            <p className="text-sm font-semibold text-gray-900 tracking-tight">Zhiyuan</p>
                            <p className="text-sm text-gray-400">Enterprise Group Inc.</p>
                        </div>
                    )}
                </div>

                {!collapsed && (
                <button
                    onClick={() => setCollapsed(true)}
                    className="p-2 cursor-pointer rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition-colors"
                >
                    <ChevronLeft className="text-gold"/>
                </button>
                )}
            </div>

            <div className="w-full h-[1px] bg-gray-300 my-2"/>

            {/* Section Label */}
            {!collapsed && (
                <p className="text-sm font-semibold text-gray-400 px-5 mb-2">
                Navigation
                </p>
            )}

            {/* Nav */}
            <nav
                className={cn(
                    "flex-1 px-3 flex flex-col gap-1",
                    collapsed ? "pt-4" : "pt-0"
                )}
            >
                {items.map((item) => {
                const isActive = pathname === item.path;

                return (
                    <Link
                        key={item.label}
                        to={item.path}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                            "flex items-center gap-3 rounded-xl transition-all duration-150",
                            collapsed ? "justify-center py-3 px-0" : "px-4 py-3",
                            isActive
                            ? "bg-gray-200 text-gray-900 font-medium"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        )}
                        data-tour={`sidebar-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                    <span>{item.icon}</span>

                    {!collapsed && <span className="text-sm">{item.label}</span>}

                    {!collapsed && isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    )}
                    </Link>
                );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 pb-5 pt-3 border-t border-gray-100">
                {collapsed && (
                <button
                    onClick={() => setCollapsed(false)}
                    className="absolute top-1/2 transform -translate-y-1/2 -right-5 bg-white p-2 cursor-pointer rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-200 transition-colors"
                >
                    <ChevronRight className="text-gold"/>
                </button>
                )}

                <button
                    data-tour='sidebar-logout'
                    onClick={logout}
                    className={cn(
                        "cursor-pointer w-full flex items-center gap-3 rounded-xl transition-all duration-150",
                        collapsed ? "justify-center py-3 px-0" : "px-4 py-3",
                        "text-gray-400 hover:bg-red-100 hover:text-red-500"
                    )}
                >
                    <LogOut size={20}/>
                    {!collapsed && <span className="text-sm">Logout</span>}
                </button>
            </div>
        </aside>
    );
}