import FiltersMenu from "../ui/FiltersMenu";
import DateInput from "../ui/DateInput";
import type { PaginationState } from "@tanstack/react-table";
import Dropdown from "../ui/Dropdown";

const withdrawalRequestStatus = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Rejected", value: "rejected" },
];

interface WithdrawalRequestControlsProps {
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
}

export default function WithdrawalRequestControls ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setPagination,
    status,
    setStatus
} : WithdrawalRequestControlsProps) {

    const clear = () => {
        setStartDate('');
        setEndDate('');
        setStatus('');
    }

    return (
        <div className="flex items-center justify-end md:justify-start md:items-end gap-3">
            <div className="w-full max-w-36 hidden md:block">
                <Dropdown 
                    options={withdrawalRequestStatus.map(s => ({
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
            <div className="hidden md:flex items-center gap-3">
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
            </div>
            <h1 className="md:hidden text-sm">Filter:</h1>
            <FiltersMenu className="flex md:hidden" containerStyle="space-y-2 gap-3 w-[90vw] right-0">
                <h1 className="font-semibold">Filter</h1>
                <div className="grid grid-cols-2 gap-3">
                    <Dropdown 
                        options={withdrawalRequestStatus.map(s => ({
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
                </div>
                <div className="flex justify-end">
                    <button
                        className="cursor-pointer text-xs md:text-sm mt-5"
                        onClick={clear}
                    >Clear</button>
                </div>
            </FiltersMenu>
            <button
                className="hidden md:block cursor-pointer text-xs md:text-sm mb-2"
                onClick={clear}
            >Clear</button>
        </div>
    )
}