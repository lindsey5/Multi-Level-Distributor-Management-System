import { useState } from "react";
import CustomTable from "../../components/ui/Table";
import { useGetStockTransferLogs } from "../../hooks/stock/use-get-stock-transfer-logs.hook";
import { useDebounce } from "../../hooks/useDebounce";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { formatDate } from "../../utils/helpers";
import type { StockTransferLog } from "../../types/stock-transfer.type";
import Button from "../../components/ui/Button";
import { Eye } from "lucide-react";
import TransferLogsControls from "../../components/transferLog/TransferLogsControls";

export default function TransferLogs () {
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const params = {
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        startDate: startDate ? formatDate(startDate) :"",
        endDate: endDate ? formatDate(endDate) : "",
    }
    const { data, isFetching } = useGetStockTransferLogs(params);

    const columns: ColumnDef<StockTransferLog>[] = [
        {
            header: "Sender",
            cell: ({ row }) => (
                <div>
                    <h3 className="font-bold">{`${row.original.sender?.firstname} ${row.original.sender?.lastname}`}</h3>
                    <p>{row.original.sender?.email}</p>
                </div>
            ),
            meta: { align: 'left' },
        },
        {
            header: "Quantity",
            accessorKey: "description",
            cell: ({ row }) => `${row.original.items.reduce((acc, item) => acc + item.quantity, 0)}`,
            meta: { align: 'center' },
        },
        {
            header: "Date",
            accessorKey: "createdAt",
            cell: info => formatDate(info.getValue() as string),
            meta: { align: 'center' },
        },
        {
            header: 'Action',
            cell: ({ row }) => (
                <Button className="px-2 py-1 ">
                    <Eye size={20}/>
                </Button>
            )
        }

    ];

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-5">
            <TransferLogsControls 
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                setSearch={setSearch}
            />
            <CustomTable
                isLoading={isFetching}
                data={data?.stockTransferLogs || []}
                columns={columns}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages || 0}
                showPagination
                noDataMessage="No Available Stock"
                total={data?.pagination.total || 0}
            />
        </div>
    )
}