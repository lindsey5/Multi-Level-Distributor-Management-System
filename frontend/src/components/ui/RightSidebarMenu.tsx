import { memo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import type { MenuItem } from "../../types/menu.type";
import { cn } from "../../utils/helpers";
import { useSelector } from "react-redux";
import type { RootState } from "../../lib/features/store";

interface DropdownMenuProps {
    menuItems: MenuItem[];
    logout: () => void;
}

const RightSidebarMenu: React.FC<DropdownMenuProps> = ({ menuItems, logout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const auth = useSelector((state: RootState) => state.auth);
    const distributor = auth.distributor;
    const { distributor_name, email } = distributor || {};

    const toggleMenu = () => {
        if (localStorage.getItem("menuTourSeen")) {
            setIsOpen((prev) => !prev);
        }
    };

    // =========================
    // GROUP MENU ITEMS
    // =========================
    const groupedItems = menuItems.reduce(
        (acc: Record<string, MenuItem[]>, item) => {
            const category = item.category || "Other";
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        },
        {}
    );

    return (
        <div className="relative lg:hidden">
            {/* HAMBURGER BUTTON */}
            <button
                data-tour="header-menu"
                onClick={toggleMenu}
                className="p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
            >
                <Menu size={24} className="text-gray-600" />
            </button>

            {/* OVERLAY */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40"
                />
            )}

            {/* RIGHT SIDEBAR */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-screen w-[280px] bg-white z-50 shadow-xl border-l border-gray-200 transform transition-transform duration-300 flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                        Menu
                    </p>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                    >
                        <X size={20} className="text-gray-700" />
                    </button>
                </div>

                {/* PROFILE */}
                <div className="px-4 py-4 border-b border-gray-200 flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                        <User size={20} />
                    </div>

                    <div className="flex flex-col gap-1 break-all">
                        <span className="text-sm font-medium text-gray-900">
                            {distributor_name}
                        </span>
                        <span className="text-xs text-gray-500">
                            {email}
                        </span>
                    </div>
                </div>

                {/* MENU ITEMS */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
                    {Object.entries(groupedItems).map(([category, items]) => (
                        <div key={category}>
                            <p className="text-[10px] font-semibold text-gray-400 px-3 mb-2 uppercase">
                                {category}
                            </p>

                            <div className="flex flex-col gap-1">
                                {items.map((item) => {
                                    const isActive =
                                        location.pathname === item.path;

                                    return (
                                        <Link
                                            key={item.label}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            data-tour={`menu-${item.label
                                                .toLowerCase()
                                                .replace(/\s/g, "-")}`}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-gray-200 text-black"
                                                    : "text-gray-900 hover:bg-gray-100"
                                            )}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* LOGOUT */}
                <div className="border-t border-gray-200 p-3">
                    <button
                        data-tour="menu-logout"
                        className="w-full cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                        onClick={logout}
                    >
                        <LogOut />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(RightSidebarMenu);