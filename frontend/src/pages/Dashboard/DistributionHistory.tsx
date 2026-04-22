import { useState } from "react";
import CustomTable from "../../components/ui/Table";
import { useGetStockTransferLogs } from "../../hooks/stock/use-get-stock-transfer-logs.hook";
import { useDebounce } from "../../hooks/useDebounce";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { formatDate } from "../../utils/helpers";
import type { StockTransferLog } from "../../types/stock-transfer.type";
import Button from "../../components/ui/Button";
import { Eye } from "lucide-react";
import TransferLogsControls from "../../components/stockTransferLog/TransferLogsControls";
import StockTransferItems from "../../components/stockTransferLog/StockTransferItems";
import StockTransferStatusChip from "../../components/stockTransferLog/StockTransferStatusChip";
import { useSocket } from "../../hooks/useSocket";

export default function TransferLogs () {
    const [stockTransfer, setStockTransfer] = useState<StockTransferLog | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const socket = useSocket({ namespace: "/notification" })
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 800);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [status, setStatus] = useState("");

    const params = {
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        status,
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
            cell: ({ row }) => `${row.original.items.reduce((acc, item) => acc + item.quantity, 0)}`,
            meta: { align: 'center' },
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: info => (
                <div className="flex justify-center">
                    <StockTransferStatusChip status={info.getValue() as string}/>
                </div>
            ),
            meta: { align: 'center' }

        },
        {
            header: "Date",
            accessorKey: "createdAt",
            cell: info => <div className="min-w-30">{formatDate(info.getValue() as string)}</div>,
            meta: { align: 'center' },
        },
        {
            header: 'Action',
            cell: ({ row }) => (
                <Button className="px-2 py-1" onClick={() => setStockTransfer(row.original)}>
                    <Eye size={20}/>
                </Button>
            )
        }
    ];

    const onRowClick = (row : StockTransferLog) => {
        setStockTransfer(row)
    }

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-5">
            <h1 className="block md:hidden text-gold font-bold text-lg">Stock Transfer History</h1>
            <StockTransferItems 
                close={() => setStockTransfer(null)}
                stockTransferLog={stockTransfer}
                socket={socket}
            />
            <TransferLogsControls 
                setStatus={setStatus}
                status={status}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                setSearch={setSearch}
                setPagination={setPagination}
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
                dataTour="stock-transfer-table"
                onRowClick={onRowClick}
            />
        </div>
    )
}