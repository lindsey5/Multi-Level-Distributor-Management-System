import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { useGetStockOrders } from "../../hooks/stock-order/use-get-stock-orders.hook"
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDate } from "../../utils/helpers";
import StockOrderControls from "../../components/stockOrder/StockOrderControls";
import CustomTable from "../../components/ui/Table";
import type { StockOrder } from "../../types/stock-order.type";
import DeliveryStatusChip from "../../components/ui/DeliveryChip";
import Button from "../../components/ui/Button";
import { Eye } from "lucide-react";
import StockOrderDetails from "../../components/stockOrder/StockOrderDetails";
import { useSearchParams } from "react-router-dom";

const getColumns = (setStockOrderId : Dispatch<SetStateAction<string | null>>) : ColumnDef<StockOrder>[] => [
    {
        header: "Stock Order ID",
        accessorKey: 'stock_order_id',
        meta: { align: 'center' },
    },
    {
        header: 'Status',
        accessorKey: "status",
        cell: info => (
            <div className="flex justify-center">
                <DeliveryStatusChip status={info.getValue() as string} />
            </div>
        ),
        meta: { align: 'center' },
    },
    {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: info => formatDate(info.getValue() as string),
        meta: { align: 'center' },
    },
    {
        header: 'Action',
        cell: ({ row }) => (
            <Button className="px-2 py-1" onClick={() => setStockOrderId(row.original._id)}>
                <Eye size={20} />
            </Button>
        ),
        meta: { align: 'center' },
    },
    
]

export default function Orders () {
    const [searchParams, setSearchParams] = useSearchParams();

    const id = searchParams.get("id");
    
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [search, setSearch] = useState(id || "");
    const debouncedSearch = useDebounce(search, 800);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [status, setStatus] = useState("");
    
    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        search: debouncedSearch,
        status,
        startDate: startDate ? formatDate(startDate) :"",
        endDate: endDate ? formatDate(endDate) : "",
    }), [pagination, debouncedSearch, status, startDate, endDate])
    

    const { data, isFetching } = useGetStockOrders(params)

    const [stockOrderId, setStockOrderId] = useState<string | null>(null);

    const columns = getColumns(setStockOrderId);

     useEffect(() => {
        const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;

        const isReload = navEntry?.type === "reload";

        if (isReload && id) {
            setSearchParams({}, { replace: true });
        }
    }, [id]);

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-5">
            <StockOrderDetails 
                close={() => setStockOrderId(null)}
                stockOrderId={stockOrderId}
            />
            <StockOrderControls 
                setStatus={setStatus}
                status={status}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                search={search}
                setSearch={setSearch}
                setPagination={setPagination}
            />
            <CustomTable
                isLoading={isFetching}
                data={data?.stockOrders || []}
                columns={columns}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages || 0}
                showPagination
                noDataMessage="No Available Stock"
                total={data?.pagination.total || 0}
                dataTour="stock-transfer-table"
            />
        </div>
    )
}