import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../lib/features/store";
import HeaderMenu from "../ui/DropdownMenu";
import { AdminMenuItems } from "../../pages/admin/AdminLayout";
import { adminLogout } from "../../lib/features/adminAuth/adminAuthSlice";


export default function AdminHeaderMenu () {
    const adminAuth = useSelector((state : RootState) => state.adminAuth);
    const admin = adminAuth.admin;
    const { firstname, lastname, email } = admin || {};

    const dispatch = useDispatch<AppDispatch>();

    const initials = firstname && lastname 
        ? `${firstname[0]}${lastname[0]}`.toUpperCase() 
        : "";

    const logout = () => {
        dispatch(adminLogout());
    }

    return (
        <div className="fixed top-5 right-5 flex items-center gap-3 z-30">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-gold font-semibold overflow-hidden">
                <span>{initials}</span>
            </div>
            <div className="hidden lg:flex flex-col text-right ">
                <span className="text-sm font-medium text-gray-900">{firstname} {lastname}</span>
                <span className="text-xs text-gray-500">{email}</span>
            </div>
            <HeaderMenu 
                menuItems={AdminMenuItems || []}
                logout={logout}
            />
        </div>
    )
}