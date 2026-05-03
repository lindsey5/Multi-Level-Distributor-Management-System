import type { ColumnDef } from "@tanstack/react-table";
import { useGetDownlineDistributors } from "../../hooks/distributor/use-get-downline-distributors.hook"
import type { Distributor } from "../../types/distributor.type";
import CustomTable from "../../components/ui/Table";

export default function DownlineDistributors () {
    const { data, isFetching } = useGetDownlineDistributors();

    const columns: ColumnDef<Distributor>[] = [
        {
            header: "Distributor Id",
            accessorKey: "distributor_id",
            meta: { align: 'center' },
        },
        {
            header: "Name",
            accessorKey: "distributor_name",
            meta: { align: 'center' }
        },
        {
            header: "Email",
            accessorKey: "email",
            meta: { align: 'center' }
        },
        {
            header: "Commission Rate",
            accessorKey: "commission_rate",
            cell: info => `${info.getValue()}%`,
            meta: { align: 'center' }
        }
    ];

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-3 md:p-5">
            <CustomTable
                isLoading={isFetching}
                data={data?.downlineDistributors || []}
                columns={columns}
                showPagination={false}
                noDataMessage="No Downline Distributor"
            />
        </div>
    )
}