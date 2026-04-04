import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../lib/features/store";
import HeaderMenu from "../ui/DropdownMenu";
import { User } from "lucide-react";
import { MenuItems } from "../../pages/DistributorLayout";
import { logout } from "../../lib/features/auth/authSlice";

export default function DistributorHeaderMenu () {
    const auth = useSelector((state : RootState) => state.auth);
    const distributor = auth.distributor;
    const { distributor_name, email } = distributor || {};

    const dispatch = useDispatch<AppDispatch>();

    const distributorLogout = () => {
        dispatch(logout());
    }

    return (
        <div className="absolute top-1/2 right-5 transform -translate-y-1/2 flex items-center gap-3 z-30">
            <div className="hidden lg:flex w-10 h-10 rounded-full bg-black items-center text-white justify-center font-semibold overflow-hidden">
                <User size={20}/>
            </div>
            <div className="hidden lg:flex flex-col text-right ">
                <span className="text-sm font-medium text-gray-900">{distributor_name}</span>
                <span className="text-xs text-gray-500">{email}</span>
            </div>
            <HeaderMenu 
                menuItems={MenuItems || []}
                logout={distributorLogout}
            />
        </div>
    )
}