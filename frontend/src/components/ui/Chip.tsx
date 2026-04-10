import { cn } from "../../utils/helpers";

export default function Chip ({ children, className } : { children : React.ReactNode, className?: string }) {
    return (
        <span className={cn(
            "font-semibold border border-gray-300 p-1 px-3 rounded-full shadow-md",
            className
        )}>
            {children}
        </span>
    )
}