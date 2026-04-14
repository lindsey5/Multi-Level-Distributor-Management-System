import FiltersMenu from "../ui/FiltersMenu";
import DateInput from "../ui/DateInput";

interface ReturnRequestControlsProps {
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
}

export default function ReturnRequestControls ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
} : ReturnRequestControlsProps) {

    const clear = () => {
        setStartDate('');
        setEndDate('');
    }

    return (
        <div className="flex items-center justify-between gap-5" data-tour="stock-transfer-controls">
            <FiltersMenu className="flex md:hidden" containerStyle="space-y-2 gap-3 w-[90vw] md:w-90 md:-right-1">
                <h1 className="font-semibold">Filter</h1>
                <div className="grid grid-cols-2 gap-3">
                    <DateInput 
                        label="From"
                        onChange={setStartDate}
                        value={startDate}
                    />
                    <DateInput 
                        label="To"
                        onChange={setEndDate}
                        value={endDate}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="cursor-pointer text-xs md:text-sm mt-5"
                        onClick={clear}
                    >Clear</button>
                </div>
            </FiltersMenu>
            <div className="hidden md:flex gap-3">
                <DateInput 
                    label="From"
                    onChange={setStartDate}
                    value={startDate}
                />
                <DateInput 
                    label="To"
                    onChange={setEndDate}
                    value={endDate}
                />
                <button
                    className="cursor-pointer text-xs md:text-sm mt-5"
                    onClick={clear}
                >Clear</button>
            </div>
        </div>
    )
}