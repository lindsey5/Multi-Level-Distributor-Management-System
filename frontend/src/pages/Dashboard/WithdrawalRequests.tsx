import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { formatDate, formatToPeso } from "../../utils/helpers";
import WithdrawalRequestControls from "../../components/withdrawalRequest/WithdrawalRequestControls";
import { useGetWithdrawalRequests } from "../../hooks/withdrawalRequest/use-get-withdrawal-requests.hook";
import type { WithdrawalRequest } from "../../types/withdrawalRequest.type";
import WithdrawalRequestDetails from "../../components/withdrawalRequest/WithdrawalRequestDetails";
import DeliveryStatusChip from "../../components/ui/DeliveryChip";
import Button from "../../components/ui/Button";
import { Eye } from "lucide-react";
import CustomTable from "../../components/ui/Table";

const getColumns = (setWithdrawalRequest : Dispatch<SetStateAction<WithdrawalRequest | null>>) : ColumnDef<WithdrawalRequest>[] => [
    {
        header: 'Date Requested',
        accessorKey: 'createdAt',
        cell: info => formatDate(info.getValue() as string),
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
        header: 'Withdrawal Method',
        accessorKey: 'withdrawal_method.type',
        cell: info => <span className="capitalize">{info.getValue() as string}</span>,
        meta: { align: 'center' },
    },
    {
        header: 'Amount',
        accessorKey: 'amount',
        cell: info => formatToPeso(Number(info.getValue())),
        meta: { align: 'center' },
    },
    {
        header: 'Action',
        cell: ({ row }) => (
            <Button 
                className="px-2 py-1"
                onClick={() => setWithdrawalRequest(row.original)}
            >
                <Eye size={20}/>
            </Button>
        ),
        meta: { align: 'center' },
    },
]

export default function WithdrawalRequests () {
    const [withdrawalRequest, setWithdrawalRequest] = useState<WithdrawalRequest | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [status, setStatus] = useState("");
    
    const params = useMemo(() => ({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        status,
        startDate: startDate ? formatDate(startDate) :"",
        endDate: endDate ? formatDate(endDate) : "",
    }), [pagination, status, startDate, endDate])

    const { data, isFetching } = useGetWithdrawalRequests(params);

    const columns = getColumns(setWithdrawalRequest);

    const onRowClick = (row : WithdrawalRequest) => setWithdrawalRequest(row);

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-3 md:p-5">
            <WithdrawalRequestDetails 
                close={() => setWithdrawalRequest(null)}
                withdrawalRequest={withdrawalRequest}
            />
            <WithdrawalRequestControls 
                setPagination={setPagination}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                status={status}
                setStatus={setStatus}
            />

            <CustomTable
                isLoading={isFetching}
                data={data?.withdrawalRequests || []}
                columns={columns}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages || 0}
                showPagination
                noDataMessage="No Withdrawal Requests Found"
                total={data?.pagination.total || 0}
                onRowClick={onRowClick}
            />
        </div>
    )
}