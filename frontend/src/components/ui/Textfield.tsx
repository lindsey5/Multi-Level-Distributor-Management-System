import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/helpers";
import { useMemo, useState } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    registration?: any;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
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
    value,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    
    const inputType = useMemo(() => type === "password" ? (showPassword ? "text" : "password") : type, [showPassword]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // run react-hook-form onChange if exists
        if (registration?.onChange) registration.onChange(e);

        // run custom onChange if exists
        if (onChange) onChange(e);
    };

    return (
        <div className={cn("w-full flex flex-col gap-1", className)}>
            {label && <label className="text-xs xl:text-sm font-medium">{label}</label>}

            <div className="relative w-full">
                {icon && iconPosition === "left" && (
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                )}

                <input
                    {...registration}
                    {...props}
                    disabled={disabled}
                    type={inputType}
                    onChange={handleChange}
                    placeholder={placeholder}
                    value={value}
                    className={cn(
                        "w-full p-3 border rounded-sm transition-all outline-none text-xs xl:text-sm",
                        icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "",
                        error
                        ? "border-red-500 focus:border-red-500"
                        : "border-[var(--border-ui)]"
                    )}
                />

                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-60"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}

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