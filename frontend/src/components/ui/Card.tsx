import React from "react";
import { cn } from "../../utils/helpers";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className }: CardProps) {
    return (
        <div className={cn(
            "bg-panel rounded-lg p-5 shadow-panel border border-[var(--border-panel)]",
            className
        )}>
            {children}
        </div>
    );
}