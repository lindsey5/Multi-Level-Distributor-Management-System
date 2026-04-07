import { cn } from "../../utils/helpers";
import type { MenuItem } from "../../types/menu.type";
import Header from "./Header";

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
        <div className={cn("w-full max-h-screen flex flex-col lg:pt-0", className)}>
            <Header title={title} description={description || ""} />

            {children}
        </div>
    )
}