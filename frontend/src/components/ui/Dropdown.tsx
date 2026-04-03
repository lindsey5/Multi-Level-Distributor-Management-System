import { cn } from "../../utils/helpers";

type Option = {
    value: string | number;
    label: string;
};

type DropdownProps = {
    label?: string;
    options: Option[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    disabled?: boolean;
    error?: string;
    className?: string;
};

export default function Dropdown({
    label,
    options,
    value,
    onChange,
    disabled,
    error,
    className,
}: DropdownProps) {
    return (
        <div className={cn("text-sm flex flex-col gap-1 w-full", className)}>
            {label && <label className="text-sm font-medium">{label}</label>}

            <select
                disabled={disabled}
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                className={cn(
                    "w-full px-3 py-2 border rounded-sm transition-all",
                    disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
                    error ? "border-red-500 focus:border-red-500" : "border-[var(--border-ui)]"
                )}
            >
                {options.map((option) => (
                    <option 
                        key={option.value} 
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}