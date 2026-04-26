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
            <div className="flex flex-wrap gap-3">
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