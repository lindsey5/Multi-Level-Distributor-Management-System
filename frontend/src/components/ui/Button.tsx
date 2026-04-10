import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../utils/helpers";
import { Link, useLocation } from "react-router-dom";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={cn(
                "shadow-md shadow-gray-400 cursor-pointer py-3 px-5 rounded-lg text-sm font-medium border transition-colors",
                "bg-gray-900 text-white border-gray-900 hover:opacity-70",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
        >
        {children}
        </button>
    );
}

interface MenuButtonProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    dataTour?: string;
}

export function MenuButton({ icon, label, path, dataTour }: MenuButtonProps) {
    const pathname = useLocation().pathname;

    return (
        <Link
            className={cn(
                "py-3 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-100",
                pathname === path && 'bg-gray-200'
            )}
            to={path}
            data-tour={dataTour}
        >
            <div className="flex gap-2 items-center">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <ChevronRight />
        </Link>
    );
}