import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type PaginationState, type Row, type Table } from "@tanstack/react-table";
import { PaginationControls } from "./Pagination";

type TableRowProps<T> = { row: Row<T> };

const TableRow = <T,>({ row }: TableRowProps<T>) => {
    return (
        <tr className="hover:bg-gray-100 transition-colors">
            {row.getVisibleCells().map((cell) => {
                const align = (cell.column.columnDef.meta as any)?.align || "left";
                return (
                <td
                    key={cell.id}
                    className={`py-3 px-4 border-b border-gray-400 text-${align}`}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
                );
            })}
        </tr>
    );
};

const TableRows = <T,>({ table }: { table: Table<T> }) => (
    <tbody>
        {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} row={row} />
        ))}
    </tbody>
);


const TableColumns = <T,>({ table }: { table: Table<T> }) => (
    <thead className="bg-black sticky top-0 z-10">
        {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
                const align = (header.column.columnDef.meta as any)?.align || "left";
                
                return (
                    <th
                        key={header.id}
                        className="py-3 px-4 text-left font-semibold text-white text-sm"
                        style={{ textAlign: align }}
                    >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                );
            })}
        </tr>
        ))}
    </thead>
);

type TableSkeletonProps = { columns: number; rows?: number };

export const TableSkeleton = ({ columns, rows = 10 }: TableSkeletonProps) => (
    <div className="flex flex-col animate-pulse px-4 py-3">
        <div className="overflow-auto">
            <table className="w-full text-sm border-collapse">
                <tbody>
                {Array.from({ length: rows }).map((_, rIdx) => (
                    <tr key={rIdx}>
                    {Array.from({ length: columns }).map((_, cIdx) => (
                        <td
                            key={cIdx}
                            className="py-3 px-4 border-b border-gray-400"
                        >
                        <div className="h-4 w-full rounded bg-gray-400"></div>
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

type CustomTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];         
    totalPages: number;
    pagination: PaginationState;
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    isLoading: boolean;
    showPagination: boolean;
    total?: number;
    noDataMessage?: string;
};

const CustomTable = <T,>({
    data,
    columns,
    pagination,
    setPagination,
    totalPages,
    isLoading,
    showPagination,
    total,
    noDataMessage = "No Data Available",
}: CustomTableProps<T>) => {
    
    const table = useReactTable({
        data,
        columns,
        pageCount: totalPages || 0,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    });

    const rows = table.getRowModel().rows;
    const cols = table.getAllColumns().length;

    return (
        <div className="flex flex-col max-h-full">
            {isLoading ? (
                <TableSkeleton columns={cols} />
            ) : rows.length < 1 ? (
                <div className="text-center py-20 text-gray-400 font-semibold">
                    {noDataMessage}
                </div>
            ) : (
                <>
                    <div className="overflow-auto flex-grow border-x border-gray-300">
                        <table className="w-full text-sm border-collapse">
                            <TableColumns table={table} />
                            <TableRows table={table} />
                        </table>
                    </div>
                    {showPagination && rows.length > 0 && (
                        <PaginationControls total={total || 0} table={table} />
                    )}
                </>
            )}
        </div>
    );
};

export default CustomTable;