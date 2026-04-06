interface DateInputProps {
    value?: string;
    onChange: (value: string) => void;
    label: string;
}

export default function DateInput ({ value, onChange, label } : DateInputProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs xl:text-sm text-muted">{label}</label>
            <input
                type="date"
                value={value}
                className="text-xs xl:text-sm border border-gray-400 bg-panel text-primary px-3 py-2 rounded-md"
                onChange={(e) => onChange(e.target.value)}
            />
    </div>
    )
}