import { useState, type SetStateAction } from "react";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useGetReturnRequests } from "../../hooks/returnRequest/use-get-return-requests.hook";
import type { ReturnRequest } from "../../types/returnRequest.type";
import { formatDate } from "../../utils/helpers";
import Button from "../../components/ui/Button";
import { Eye } from "lucide-react";
import CustomTable from "../../components/ui/Table";
import ReturnDetailsModal from "../../components/return-request/ReturnDetailsModal";
import ReturnRequestControls from "../../components/return-request/ReturnRequestControls";
import ReturnTour from "../../components/ui/Tour/ReturnTour";

const getColumns = (setReturnRequest : React.Dispatch<SetStateAction<ReturnRequest | null>>) : ColumnDef<ReturnRequest>[] => [
    {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: info => <div className="min-w-30">{formatDate(info.getValue() as string)}</div>,
        meta: { align: 'center' }
    },
    {
        header: 'Reason',
        accessorKey: 'reason',
        cell: info => <div className="max-w-50 truncate text-center">{info.getValue() as string}</div>,
        meta: { align: 'center' }
    },
    {
        header: 'Total Items',
        cell: ({ row }) => row.original.items.length,
        meta: { align: 'center' }
    },
    {
        header: 'Pending Items',
        cell: ({ row }) => row.original.items.map(item => item.status === 'pending' ? item : null).filter(item => item).length || 'N/A',
        meta: { align: 'center' }
    },
    {
        header: 'Action',
        cell: ({ row }) => (
            <Button className="px-2 py-1" onClick={() => setReturnRequest(row.original)}>
                <Eye size={20} />
            </Button>
        ),
        meta: { align: 'center' }
    }
]

export default function ReturnHistory () {
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [returnRequest, setReturnRequest] = useState<ReturnRequest | null>(null);

    const { data, isFetching } = useGetReturnRequests({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        startDate,
        endDate
    })


    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-5">
            <ReturnTour />
            <ReturnDetailsModal 
                returnRequest={returnRequest}
                close={() => setReturnRequest(null)}
            />
            <ReturnRequestControls 
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
            />
            <CustomTable 
                isLoading={isFetching}
                data={data?.returnRequests || []}
                columns={getColumns(setReturnRequest)}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages || 0}
                showPagination
                noDataMessage="No Return Requests Found"
                total={data?.pagination.total || 0}
                dataTour="return-history-table"
            />
        </div>
    )
}