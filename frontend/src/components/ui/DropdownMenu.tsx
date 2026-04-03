import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import type { MenuItem } from "../../types/menu.type";
import Card from "./Card";
import { cn } from "../../utils/helpers";

interface DropdownMenuProps {
  menuItems: MenuItem[];
  logout: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ menuItems, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative lg:hidden">
      {/* Hamburger button */}
      <button
        onClick={toggleMenu}
        className="cursor-pointer p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gold"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-60 shadow-xl p-2 flex flex-col gap-1 z-50">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? "bg-gray-200 text-gold" : "text-gray-900 hover:bg-gray-200"
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