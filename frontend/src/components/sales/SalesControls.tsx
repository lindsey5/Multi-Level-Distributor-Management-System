import { Search } from "lucide-react";
import TextField from "../ui/Textfield";
import FiltersMenu from "../ui/FiltersMenu";
import DateInput from "../ui/DateInput";
import Dropdown from "../ui/Dropdown";
import type { SortOption } from "../../types/types.type";
import { getKeyByValue } from "../../utils/helpers";
import type { PaginationState } from "@tanstack/react-table";

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
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
}

export default function SalesControls ({
    setSearch,
    setSorting,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sorting,
    setPagination
 } : SalesControlsProps) {

    const clear = () => {
        setStartDate('');
        setEndDate('');
        setSorting({ 
            sortBy: 'createdAt',
            order: 'desc'
        })
    }

    const reset = () => {
        setPagination(prev => ({ ...prev, pageIndex: 0}))
    }

    return (
        <div className="flex gap-3 items-center" data-tour="sales-controls">
            <TextField 
                className="md:max-w-100"
                icon={<Search className="text-gray-400"/>}
                placeholder="Search by product name, variant name or sku..."
                onChange={(e) => {
                    reset();
                    setSearch(e.target.value);
                }}
            />
            <FiltersMenu containerStyle="space-y-2 gap-3 w-[90vw] md:w-90 md:-right-1">
                <h1 className="font-semibold">Filter</h1>
                <div className="grid grid-cols-2 gap-3">
                    <DateInput 
                        label="From"
                        onChange={(value) => {
                            reset();
                            setStartDate(value);
                        }}
                        value={startDate}
                    />
                    <DateInput 
                        label="To"
                        onChange={(value) => {
                            reset();
                            setEndDate(value);
                        }}
                        value={endDate}
                    />
                    <Dropdown 
                        label="Sort"
                        options={Object.keys(options).map(opt => ({ label: opt, value: opt }))}
                        onChange={(value) => {
                            reset()
                            setSorting(options[value])
                        }}
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