import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/helpers";

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