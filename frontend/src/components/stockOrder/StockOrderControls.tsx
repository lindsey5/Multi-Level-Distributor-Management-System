import { Search } from "lucide-react";
import FiltersMenu from "../ui/FiltersMenu";
import TextField from "../ui/Textfield";
import DateInput from "../ui/DateInput";
import type { PaginationState } from "@tanstack/react-table";
import Dropdown from "../ui/Dropdown";

const stockTransferStatus = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Processing", value: "processing" },
    { label: "Delivered", value: "delivered" },
    { label: "Received", value: "received" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Rejected", value: "rejected" },
    { label: "Failed", value: "failed" },
];

interface StockOrderControlsProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
}

export default function StockOrderControls ({
    search,
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setPagination,
    status,
    setStatus
} : StockOrderControlsProps) {

    const clear = () => {
        setStartDate('');
        setEndDate('');
        setStatus('');
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 md:max-w-100">
                <TextField 
                    className="w-full"
                    icon={<Search className="text-gray-400"/>}
                    placeholder="Search by stock order id..."
                    value={search}
                    onChange={(e) => {
                        setPagination(prev => ({...prev, pageIndex: 0}))
                        setSearch(e.target.value);
                    }}
                />
            </div>
            <FiltersMenu containerStyle="space-y-2 gap-3 w-[90vw] md:w-90 md:-right-1">
                <h1 className="font-semibold">Filter</h1>
                <div className="grid grid-cols-2 gap-3">
                    <DateInput 
                        label="From"
                        onChange={(value) => {
                            setPagination(prev => ({...prev, pageIndex: 0}));
                            setStartDate(value);
                        }}
                        value={startDate}
                    />
                    <DateInput 
                        label="To"
                        onChange={(value) => {
                            setPagination(prev => ({...prev, pageIndex: 0}));
                            setEndDate(value)
                        }}
                        value={endDate}
                    />
                    <Dropdown 
                        options={stockTransferStatus.map(s => ({
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
                        className="cursor-pointer text-xs md:text-sm mt-5"
                        onClick={clear}
                    >Clear</button>
                </div>
            </FiltersMenu>
        </div>
    )
}