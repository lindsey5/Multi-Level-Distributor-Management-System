import { Search } from "lucide-react";
import TextField from "../ui/Textfield";
import FiltersMenu from "../ui/FiltersMenu";
import DateInput from "../ui/DateInput";
import type { PaginationState } from "@tanstack/react-table";
import Dropdown from "../ui/Dropdown";

const sponsoredItemStatus = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Completed", value: "received" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Rejected", value: "rejected" },
    { label: "Expired", value: "expired" },
];

interface SponsoredItemControlsProps {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
}

export default function SponsoredItemControls ({
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setPagination,
    status,
    setStatus
 } : SponsoredItemControlsProps) {

    const clear = () => {
        setStartDate('');
        setEndDate('');
    }

    const reset = () => {
        setPagination(prev => ({ ...prev, pageIndex: 0}))
    }

    return (
        <div className="flex gap-3 items-center" data-tour="sales-controls">
            <TextField 
                className="md:max-w-100"
                icon={<Search className="text-gray-400"/>}
                placeholder="Search by sponsored id, product, variant or sku..."
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
                        options={sponsoredItemStatus.map(s => ({
                            label: s.label,
                            value: s.value
                        }))}
                        label="Status"
                        onChange={(value) => {
                            setPagination(prev => ({...prev, pageIndex: 0}))
                            setStatus(value as string);
                        }}
                        value={status}
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