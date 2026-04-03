import { type Table } from "@tanstack/react-table";
import { cn } from "../../utils/helpers";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationButtonProps {
    onClick: () => void;
    disabled?: boolean;
    tooltip?: string;
    children: React.ReactNode;
    className?: string;
}

const PaginationButton = ({
    onClick,
    disabled = false,
    tooltip,
    children,
    className = "",
}: PaginationButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative group p-1 rounded-md transition-colors",
                !disabled && "cursor-pointer hover:bg-gray-100",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            >
            {tooltip && !disabled && (
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap">
                {tooltip}
                </span>
            )}
            {children}
        </button>
    );
};

interface PaginationControlsProps<T> {
  table: Table<T>;
  total: number;
}

export const PaginationControls = <T,>({ table, total }: PaginationControlsProps<T>) => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const pageCount = table.getPageCount();
    const delta = 2;

    const getPageNumbers = () => {
        const range: (number | string)[] = [];
        const left = Math.max(0, pageIndex - delta);
        const right = Math.min(pageCount - 1, pageIndex + delta);

        for (let i = 0; i < pageCount; i++) {
        if (i === 0 || i === pageCount - 1 || (i >= left && i <= right)) {
            range.push(i);
        } else if (range[range.length - 1] !== "...") {
            range.push("...");
        }
        }

        return range;
    };

    const startRow = pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, total);

    return (
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 mt-6">

            <div className="flex items-center gap-5">
                <div className="text-sm text-gray-600">
                    Showing {startRow} - {endRow} of {total}
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span>Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1"
                    >
                    {[5, 10, 20, 50, 100].map((size) => (
                        <option key={size} value={size}>
                        {size}
                        </option>
                    ))}
                    </select>
                </div>
            </div>

            {/* Page Buttons */}
            <div className="flex items-center gap-1">
                <PaginationButton
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    tooltip="First Page"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </PaginationButton>
                <PaginationButton
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    tooltip="Previous Page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </PaginationButton>

                {getPageNumbers().map((p, idx) =>
                    typeof p === "number" ? (
                        <button
                            key={idx}
                            onClick={() => table.setPageIndex(p)}
                            className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                                p === pageIndex
                                ? "bg-black text-white font-semibold"
                                : "text-gray-800 hover:bg-gray-100"
                            )}
                        >
                        {p + 1}
                        </button>
                    ) : (
                        <span key={idx} className="px-2 text-gray-400">
                        {p}
                        </span>
                    )
                )}

                <PaginationButton
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    tooltip="Next Page"
                >
                    <ChevronRight className="w-4 h-4" />
                </PaginationButton>
                <PaginationButton
                    onClick={() => table.setPageIndex(pageCount - 1)}
                    disabled={!table.getCanNextPage()}
                    tooltip="Last Page"
                >
                    <ChevronsRight className="w-4 h-4" />
                </PaginationButton>
            </div>
        </div>
    );
};