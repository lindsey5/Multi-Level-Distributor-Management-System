
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
        <div className={cn(
            "relative w-full",
            className
        )}>
            <header className="relative py-7 px-5 pb-5 border-b border-[var(--border-panel)] shadow-panel shadow-md">
                <h1 className="text-2xl font-semibold text-gold mb-1">{title}</h1>
                {description && <p className="text-sm text-gray-500">{description}</p>}
                <DistributorHeaderMenu />
            </header>

            {children}
        </div>
    )
}