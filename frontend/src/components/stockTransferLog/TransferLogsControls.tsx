import { Search } from "lucide-react";
import FiltersMenu from "../ui/FiltersMenu";
import TextField from "../ui/Textfield";
import DateInput from "../ui/DateInput";

interface TransferLogsControlsProps {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
}

export default function TransferLogsControls ({
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
} : TransferLogsControlsProps) {

    const clear = () => {
        setStartDate('');
        setEndDate('');
    }

    return (
        <div className="flex items-center justify-between gap-5">
            <div className="flex-1 flex-0 md:max-w-100">
                <TextField 
                    className="md:max-w-84"
                    icon={<Search className="text-gray-400"/>}
                    placeholder="Search by variant name, sku..."
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
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