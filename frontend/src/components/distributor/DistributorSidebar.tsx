import { useDispatch } from "react-redux";
import Sidebar from "../ui/Sidebar";
import type { AppDispatch } from "../../lib/features/store";
import { MenuItems } from "../../pages/DistributorLayout";
import { logout } from "../../lib/features/auth/authSlice";

interface DistributorSidebarProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DistributorSidebar({ collapsed, setCollapsed } : DistributorSidebarProps) {
    const dispatch = useDispatch<AppDispatch>();

    const distributorLogout = () => {
        dispatch(logout());
    }

    return (
        <Sidebar 
            items={MenuItems} 
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            logout={distributorLogout}
        />
    );
}