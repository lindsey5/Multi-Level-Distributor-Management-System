import { User, Wallet, Lock, LogOut, ChevronRight, MoreHorizontal } from "lucide-react";
import Card from "../components/ui/Card";
import { MenuButton } from "../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../lib/features/store";
import { Outlet } from "react-router-dom";
import { logout } from "../lib/features/auth/authSlice";
import { useEffect, useState } from "react";
import { cn } from "../utils/helpers";

export default function ProfileLayout() {
    const auth = useSelector((store: RootState) => store.auth);
    const distributor = auth.distributor;

    const [show, setShow] = useState(false);
    const dispatch = useDispatch();

    const menuItems = (
        <>
        <MenuButton 
            icon={<User size={20} />} 
            label="My Profile" 
            path="/distributor/profile" 
        />
        <MenuButton
            icon={<Wallet size={20} />}
            label="Wallet Balance"
            path="/distributor/profile/wallet-balance"
        />
        <MenuButton
            icon={<Lock size={20} />}
            label="Change Password"
            path="/distributor/profile/change-password"
        />

        <button
            className="w-full py-3 px-4 flex justify-between items-center cursor-pointer hover:bg-red-50 hover:text-red-500"
            onClick={() => dispatch(logout())}
        >
            <div className="flex gap-2 items-center">
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
            </div>
            <ChevronRight />
        </button>
        </>
    );

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('#profile-dropdown')) {
                setShow(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, [])

    return (
        <div className="md:flex items-start gap-5 p-2 md:p-5 space-y-4 md:space-y-0">
            <Card className="md:w-80 px-0 py-3 relative">
                <div className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-start gap-3">
                        <div className="md:block hidden p-3 bg-black rounded-full text-white">
                            <User size={30} />
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-sm md:text-base font-bold">{distributor?.distributor_name}</h1>
                            <p className="text-gray-400 text-xs md:text-sm">{distributor?.email}</p>
                        </div>
                    </div>

                    <div className="relative" id="profile-dropdown">
                        <button
                            className="md:hidden cursor-pointer p-2 rounded-full hover:bg-gray-200"
                            onClick={() => setShow((prev) => !prev)}
                        >
                            <MoreHorizontal />
                        </button>

                        {/* Mobile Dropdown Menu */}
                        <div
                            className={cn(
                                "transition-all duration-200 ease-in absolute top-10 right-5 p-3 rounded-md border border-gray-300 shadow-md space-y-1 w-64 bg-white z-50 md:hidden",
                                show ? "opacity-100 visible" : "opacity-0 invisible"
                            )}
                        >
                        {menuItems}
                        </div>
                    </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block w-full space-y-1 mt-4 bg-white">
                    {menuItems}
                    </div>
            </Card>
            <Outlet />
        </div>
    );
}