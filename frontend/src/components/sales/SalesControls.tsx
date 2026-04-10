import { Search } from "lucide-react";
import TextField from "../ui/Textfield";
import FiltersMenu from "../ui/FiltersMenu";
import DateInput from "../ui/DateInput";
import Dropdown from "../ui/Dropdown";
import type { SortOption } from "../../types/types.type";
import { getKeyByValue } from "../../utils/helpers";

const options: Record<string, SortOption> = {
    'Newest' : { sortBy: 'createdAt', order: 'desc' },
    'Oldest' : { sortBy: 'createdAt', order: 'asc' },
    'Sales (HIGH - LOW)': { sortBy: 'total_amount', order: 'desc' },
    'Sales (LOW - HIGH)': { sortBy: 'total_amount', order: 'asc' },
    'Quantity (ASC)' : { sortBy: 'quantity', order: 'asc' },
    'Quantity (DESC)' : { sortBy: 'quantity', order: 'desc' },
};

interface SalesControlsProps {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setSorting: React.Dispatch<React.SetStateAction<SortOption>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    sorting: SortOption;
}

export default function SalesControls ({
    setSearch,
    setSorting,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sorting
 } : SalesControlsProps) {

    const clear = () => {
        setStartDate('');
        setEndDate('');
        setSorting({ 
            sortBy: 'createdAt',
            order: 'desc'
        })
    }

    return (
        <div className="flex gap-3 items-center">
            <TextField 
                className="md:max-w-100"
                icon={<Search className="text-gray-400"/>}
                placeholder="Search by product name, variant name or sku..."
                onChange={(e) => setSearch(e.target.value)}
            />
            <FiltersMenu containerStyle="space-y-2 gap-3 w-[90vw] md:w-90 md:-right-1">
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
                    <Dropdown 
                        label="Sort"
                        options={Object.keys(options).map(opt => ({ label: opt, value: opt }))}
                        onChange={(value) => setSorting(options[value]) }
                        value={getKeyByValue(options, sorting) || ""}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        className="cursor-pointer text-xs md:text-sm"
                        onClick={clear}
                    >
                        Clear
                    </button>
                </div>
            </FiltersMenu>
        </div>
    )
}