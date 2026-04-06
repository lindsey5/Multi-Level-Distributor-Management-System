import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, User } from "lucide-react";
import type { MenuItem } from "../../types/menu.type";
import Card from "./Card";
import { cn } from "../../utils/helpers";
import { useSelector } from "react-redux";
import type { RootState } from "../../lib/features/store";

interface DropdownMenuProps {
  menuItems: MenuItem[];
  logout: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ menuItems, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const auth = useSelector((state : RootState) => state.auth);
  const distributor = auth.distributor;
  const { distributor_name, email } = distributor || {};
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative lg:hidden">
      {/* Hamburger button */}
      <button
        onClick={toggleMenu}
        className="p-2 cursor-pointer rounded-full hover:bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <div className="rounded-full flex items-center text-gray-600 justify-center font-semibold">
            <Menu size={24}/>
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <Card className="absolute right-5 -bottom-90 mt-2 w-60 shadow-xl p-2 flex flex-col gap-1 z-50">
          <div className="px-2 pt-2 pb-3 border-b border-gray-300  flex gap-2">
              <div className="w-10 h-10 rounded-full bg-black flex items-center text-white justify-center font-semibold overflow-hidden">
                <User size={20}/>
            </div>
            <div className="flex flex-col gap-1 break-all">
              <span className="text-sm font-medium text-gray-900">{distributor_name}</span>
              <span className="text-xs text-gray-500">{email}</span>
            </div>
          </div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? "bg-gray-300" : "text-gray-900 hover:bg-gray-200"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
          <button 
            className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors text-gray-900 hover:bg-gray-200"
            onClick={logout}
          >
            <LogOut />
            Logout
          </button>
        </Card>
      )}
    </div>
  );
};

export default DropdownMenu;