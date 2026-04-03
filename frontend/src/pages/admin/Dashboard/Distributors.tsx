import { useState } from "react";
import { useGetDistributors } from "../../../hooks/distributor/use-get-distributors.hook"
import { useDebounce } from "../../../hooks/useDebounce";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import CustomTable from "../../../components/ui/Table";
import type { Distributor } from "../../../types/distributor.type";
import TextField from "../../../components/ui/Textfield";
import { Search } from "lucide-react";
import Dropdown from "../../../components/ui/Dropdown";
import { formatDate, formatToPeso } from "../../../utils/helpers";

const sortOptions = [
    { label: 'Distributor Name', value: 'distributor_name' },
    { label: 'Wallet Balance', value: 'wallet_balance' },
    { label: 'Date Created', value: 'createdAt' },
    { label: 'Total Stocks', value: 'total_stocks' }
]

const orderOptions = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' }
]

export default function Distributors () {
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 200);

    const { data, isFetching } = useGetDistributors({
        search: debouncedSearch,
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        sortBy: sortBy,
        order: order
    });

    const columns: ColumnDef<Distributor>[] = [
        {
            header: "Name",
            accessorKey: "distributor_name",
            meta: { align: 'left '}
        },
        {
            header: "Email",
            accessorKey: "email",
            meta: { align: 'center '}
        },
        {
            header: "Commission Rate",
            cell: ({ row }) => `${row.original.commission_rate} %`,
            meta: { align: 'center '}
        },
        {
            header: "Recruit by",
            cell: ({ row }) => row.original.parent_distributor ? row.original.parent_distributor.distributor_name : "N/A",
            meta: { align: 'center '}
        },
        {
            header: "Wallet Balance",
            accessorKey: "wallet_balance",
            cell: ({ row }) => formatToPeso(row.original.wallet_balance),
            meta: { align: 'center '}
        },
        {
            header: "Total Stocks",
            accessorKey: "total_stocks",
            meta: { align: 'center '}
        },
        {
            header: "Date Created",
            accessorKey: "createdAt",
            cell: ({ row }) => formatDate(row.original.createdAt),
            meta: { align: 'center '}
        }
    ]


    return  (
        <div className="flex flex-col gap-5">
            <div className="w-full flex flex-col-reverse md:flex-row items-end gap-3 justify-between">
                <TextField 
                    className="md:max-w-84"
                    icon={<Search className="text-gray-400"/>}
                    placeholder="Search by name, email..."
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
                <div className="w-full md:max-w-100 flex gap-3">
                    <Dropdown 
                        label="Sort by"
                        options={sortOptions}
                        value={sortBy}
                        onChange={(value) => setSortBy(value as string)}
                    />
                    <Dropdown 
                        label="Sort by"
                        options={orderOptions}
                        value={order}
                        onChange={(value) => setOrder(value as 'asc' | 'desc')}
                    />
                </div>
            </div>
            <CustomTable 
                data={data?.distributors || []}
                columns={columns}
                isLoading={isFetching}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages || 0}
                showPagination
                noDataMessage="No Distributors Found"
                total={data?.pagination.total || 0}
            />
        </div>
    )
}