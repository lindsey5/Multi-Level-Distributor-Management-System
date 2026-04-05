import { cn } from "../../utils/helpers";
import type { MenuItem } from "../../types/menu.type";
import DistributorHeaderMenu from "../distributor/DistributorHeaderMenu";

interface PageContainerProps {
    title: string;
    description?: string;
    className?: string;
    children: React.ReactNode;
    menuItems?: MenuItem[];
}

export default function PageContainer ({ 
    title,
    description,
    className,
    children,
} : PageContainerProps) {

    return (
        <div className={cn("relative w-full pt-25 lg:pt-0", className)}>
            <header className="flex gap-3 items-center z-50 bg-white fixed top-0 inset-x-0 lg:relative p-5 border-b border-[var(--border-panel)] shadow-panel shadow-md">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-black">
                    <img
                        src="/logo.png"
                        alt="logo"
                        className="w-full h-full object-contain"
                    />
                </div>
                <div className="break-all">
                    <h1 className="text-lg xl:text-xl font-semibold text-gold mb-1">{title}</h1>
                    {description && <p className="text-xs xl:text-sm text-gray-500">{description}</p>}
                </div>
                <DistributorHeaderMenu />
            </header>

            {children}
        </div>
    )
}