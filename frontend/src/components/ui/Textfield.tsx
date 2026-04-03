import { cn } from "../../utils/helpers";

type InputProps = {
    label?: string;
    type?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    registration?: any; 
    className?: string;
    icon?: React.ReactNode; 
    iconPosition?: "left" | "right";
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
};

export default function TextField({
    label,
    type = "text",
    className,
    placeholder,
    disabled,
    error,
    registration,
    icon,
    iconPosition = "left",
    onChange,
    value
}: InputProps) {
    return (
        <div className={cn("w-full flex flex-col gap-1", className)}>
            {label && <label className="text-sm font-medium">{label}</label>}

            <div className="relative w-full">
                {icon && iconPosition === "left" && (
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                )}

                <input
                    {...registration}
                    disabled={disabled}
                    type={type}
                    {...(onChange ? { onChange } : {})}
                    placeholder={placeholder}
                    value={value}
                    className={cn(
                        "w-full p-3 border rounded-sm transition-all outline-none text-sm",
                        icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "",
                        error
                        ? "border-red-500 focus:border-red-500"
                        : "border-[var(--border-ui)]"
                    )}
                />

                {icon && iconPosition === "right" && (
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                )}
            </div>

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}