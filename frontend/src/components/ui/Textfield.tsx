import { cn } from "../../utils/helpers";

type InputProps = {
    label?: string;
    type?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    registration?: any; 
    className?: string;
};

export default function TextField({
    label,
    type = "text",
    className,
    placeholder,
    disabled,
    error,
    registration,
}: InputProps) {
    return (
        <div className={cn(
            "w-full flex flex-col gap-1",
            className
        )}>
            {label && (
                <label className="text-sm font-medium">
                    {label}
                </label>
            )}

            <input
                {...registration}
                disabled={disabled}
                type={type}
                placeholder={placeholder}
                className={`w-full p-3 border rounded-sm transition-all
                    ${
                        error
                            ? "border-red-500 focus:border-red-500"
                            : "border-[var(--border-ui)]"
                    }
                `}
            />

            {error && (
                <span className="text-xs text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
}