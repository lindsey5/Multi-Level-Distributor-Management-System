import { Package, Undo2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { cn } from "../../utils/helpers";

interface ModeToggleProps {
    enableReturn: boolean;
    setEnableReturn: Dispatch<SetStateAction<boolean>>;
}

export default function ModeToggle ({ enableReturn, setEnableReturn } : ModeToggleProps) {
    return (
        <div className="flex bg-white border border-gray-300 rounded-xl p-1 w-fit shrink-0">
            <button
                onClick={() => setEnableReturn(false)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm rounded-lg",
                    !enableReturn ? "bg-black text-white" : "text-gray-600"
                )}
            >
                <Package size={16} />
                Sell
            </button>

            <button
                onClick={() => setEnableReturn(true)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm rounded-lg",
                    enableReturn ? "bg-black text-white" : "text-gray-600"
                )}
            >
                <Undo2 size={16} />
                Return
            </button>
        </div>
    )
}