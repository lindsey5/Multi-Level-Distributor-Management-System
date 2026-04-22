import FiltersMenu from "../ui/FiltersMenu";
import DateInput from "../ui/DateInput";
import type { PaginationState } from "@tanstack/react-table";

interface ReturnRequestControlsProps {
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
}

export default function ReturnRequestControls ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setPagination,
} : ReturnRequestControlsProps) {

    const clear = () => {
        setStartDate('');
        setEndDate('');
    }

    return (
        <div className="flex items-center justify-between gap-5" data-tour="return-history-controls">
            <FiltersMenu className="flex md:hidden" containerStyle="space-y-2 gap-3 w-[90vw] md:w-90 md:-right-1">
                <h1 className="font-semibold">Filter</h1>
                <div className="grid grid-cols-2 gap-3">
                    <DateInput 
                        label="From"
                        onChange={(value) => {
                            setPagination(prev => ({...prev, pageIndex: 0}))
                            setStartDate(value);
                        }}
                        value={startDate}
                    />
                    <DateInput 
                        label="To"
                        onChange={(value) => {
                            setPagination(prev => ({...prev, pageIndex: 0}))
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
            <div className="hidden md:flex gap-3">
                <DateInput 
                    label="From"
                    onChange={(value) => {
                        setPagination(prev => ({...prev, pageIndex: 0}))
                        setStartDate(value)
                    }}
                    value={startDate}
                />
                <DateInput 
                    label="To"
                    onChange={(value) => {
                        setPagination(prev => ({...prev, pageIndex: 0}))
                        setEndDate(value)
                    }}
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