import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { MenuItem } from "../../types/menu.type";
import { cn } from "../../utils/helpers";

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

    // =========================
    // GROUP ITEMS BY CATEGORY
    // =========================
    const groupedItems = items.reduce(
        (acc: Record<string, MenuItem[]>, item) => {
            const category = item.category || "Other";

            if (!acc[category]) acc[category] = [];

            acc[category].push(item);

            return acc;
        },
        {}
    );

    return (
        <aside
            className={cn(
                "z-20 fixed left-0 inset-y-0 hidden lg:flex flex-col transition-all duration-300 py-3",
                "bg-white border-r border-gray-300",
                collapsed ? "w-20" : "w-72"
            )}
        >
            {/* ===================== */}
            {/* LOGO */}
            {/* ===================== */}
            <div
                className={cn(
                    "flex items-center h-16 px-5 border-b border-gray-100",
                    collapsed ? "justify-center" : "justify-between"
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-black">
                        <img
                            src="/logo.png"
                            alt="logo"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {!collapsed && (
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Zhiyuan
                            </p>
                            <p className="text-sm text-gray-400">
                                Enterprise Group Inc.
                            </p>
                        </div>
                    )}
                </div>

                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-200"
                    >
                        <ChevronLeft className="text-gold" />
                    </button>
                )}
            </div>

            <div className="w-full h-[1px] bg-gray-300 my-2" />

            {/* ===================== */}
            {/* NAVIGATION */}
            {/* ===================== */}
            <nav className="flex-1 px-3 overflow-y-auto">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="mb-4">
                        {/* Category label */}
                        {!collapsed && (
                            <p className="text-xs font-semibold text-gray-400 px-4 mb-2 uppercase">
                                {category}
                            </p>
                        )}

                        {/* Items */}
                        <div className="flex flex-col gap-1">
                            {items.map((item) => {
                                const isActive = pathname === item.path;

                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        title={collapsed ? item.label : undefined}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl transition-all duration-150",
                                            collapsed
                                                ? "justify-center py-3 px-0"
                                                : "px-4 py-3",
                                            isActive
                                                ? "bg-gray-200 text-gray-900 font-medium"
                                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                                        )}
                                    >
                                        <span>{item.icon}</span>

                                        {!collapsed && (
                                            <span className="text-sm">
                                                {item.label}
                                            </span>
                                        )}

                                        {!collapsed && isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* ===================== */}
            {/* FOOTER */}
            {/* ===================== */}
            <div className="px-3 pb-5 pt-3 border-t border-gray-100 relative">
                {/* Expand button */}
                {collapsed && (
                    <button
                        onClick={() => setCollapsed(false)}
                        className="absolute top-1/2 -right-5 transform -translate-y-1/2 bg-white p-2 rounded-full border border-gray-300 hover:bg-gray-200"
                    >
                        <ChevronRight className="text-gold" />
                    </button>
                )}

                {/* Logout */}
                <button
                    onClick={logout}
                    className={cn(
                        "w-full flex items-center gap-3 rounded-xl transition-all duration-150",
                        collapsed
                            ? "justify-center py-3 px-0"
                            : "px-4 py-3",
                        "text-gray-400 hover:bg-red-100 hover:text-red-500"
                    )}
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="text-sm">Logout</span>}
                </button>
            </div>
        </aside>
    );
}