import type React from "react";
import { Filter } from "lucide-react";
import Card from "./Card";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/helpers";

interface FiltersMenuProps {
    children: React.ReactNode;
    className?: string;
    containerStyle?: string;
}

export default function FiltersMenu({
    children,
    className,
    containerStyle
}: FiltersMenuProps) {
    const [show, setShow] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShow(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={menuRef} className={cn("relative", className)}>
            <button
                className="p-2 rounded-md"
                onClick={() => setShow((prev) => !prev)}
            >
                <Filter size={20} />
            </button>

            <Card
                className={cn(
                "absolute right-0 top-8 mt-2 w-56 z-20 transition-all duration-200 ease-in",
                show ? "opacity-100 visible" : "opacity-0 invisible",
                containerStyle
                )}
            >
                {children}
            </Card>
        </div>
    );
}