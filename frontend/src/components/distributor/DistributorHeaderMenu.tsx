import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../lib/features/store";
import HeaderMenu from "../ui/DropdownMenu";
import { logout } from "../../lib/features/auth/authSlice";
import { MenuItems } from "../../pages/DistributorLayout";
import NotificationBell from "../ui/NotificationBell";

export default function DistributorHeaderMenu () {
    const auth = useSelector((state : RootState) => state.auth);
    const distributor = auth.distributor;
    const { distributor_name, email } = distributor || {};

    const dispatch = useDispatch<AppDispatch>();

    const distributorLogout = () => {
        dispatch(logout());
    }

    return (
        <div className="px-3 flex items-center gap-3">
            <div className="hidden lg:flex flex-col text-right p-3">
                <span className="text-sm font-medium text-gray-900">{distributor_name}</span>
                <span className="text-xs text-gray-500">{email}</span>
            </div>
            <NotificationBell />
            <HeaderMenu 
                menuItems={MenuItems || []}
                logout={distributorLogout}
            />
        </div>
    )
}