import { useState } from "react";
import { useGetSales } from "../../hooks/sale/use-get-sales.hook"
import type { SortOption } from "../../types/types.type";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import type { DistributorSale } from "../../types/sale.type";
import { formatDate, formatToPeso } from "../../utils/helpers";
import CustomTable from "../../components/ui/Table";
import { useDebounce } from "../../hooks/useDebounce";
import SalesControls from "../../components/sales/SalesControls";

export default function Sales () {
    const [sorting, setSorting] = useState<SortOption>({
        order: 'desc',
        sortBy: 'createdAt'
    });
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 200);
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { data, isFetching } = useGetSales({
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        sortBy: sorting.sortBy,
        order: sorting.order,
        startDate,
        endDate,
        search: debouncedSearch
    });

    const columns: ColumnDef<DistributorSale>[] = [
        {
            header: "Item",
            cell: ({ row }) => (
                <div className="min-w-30 flex gap-3 items-center">
                    <img 
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-md object-cover" 
                        src={row.original.variant.image_url} 
                        alt={row.original.variant.variant_name}
                    />
                    <h1>{row.original.variant.variant_name}</h1>
                </div>
            ),
            meta: { align: 'left' },
        },
        {
            header: "SKU",
            accessorKey: 'variant.sku',
            meta: { align: 'center' }
        },
        {
            header: "Quantity",
            accessorKey: 'quantity',
            meta: { align: 'center' }
        },
        {
            header: 'Date',
            accessorKey: 'createdAt',
            cell: (info) => formatDate(info.getValue() as string),
            meta: { align: 'center' }
        },
        {
            header: "Sales",
            accessorKey: 'total_amount',
            cell: info => <span className="font-bold">{formatToPeso(info.getValue() as number)}</span>,
            meta: { align: 'center' }
        },
    ];

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-5">
            <SalesControls 
                sorting={sorting}
                setSorting={setSorting}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                setSearch={setSearch}
            />
            <CustomTable
                isLoading={isFetching}
                data={data?.distributorSales || []}
                columns={columns}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages || 0}
                showPagination
                noDataMessage="No Available Stock"
                total={data?.pagination.total || 0}
            />
            <div className="flex justify-end">
                <h1 className="font-bold mt-2 text-md md:text-lg">Total Sales: {formatToPeso(data?.totalSales || 0)}</h1>
            </div>
        </div>
    )
}