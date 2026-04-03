import { useDispatch } from "react-redux";
import { AdminMenuItems } from "../../pages/admin/AdminLayout";
import Sidebar from "../ui/Sidebar";
import { adminLogout } from "../../lib/features/adminAuth/adminAuthSlice";
import type { AppDispatch } from "../../lib/features/store";

interface AdminSidebarProps {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminSidebar({ collapsed, setCollapsed } : AdminSidebarProps) {
    const dispatch = useDispatch<AppDispatch>();

    const logout = () => {
        dispatch(adminLogout());
    }

    return (
        <Sidebar 
            items={AdminMenuItems} 
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            logout={logout}
        />
    );
}