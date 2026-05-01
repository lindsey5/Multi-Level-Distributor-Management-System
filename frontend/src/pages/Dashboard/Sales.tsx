import { useState } from "react";
import { useGetSales } from "../../hooks/sale/use-get-sales.hook"
import type { SortOption } from "../../types/types.type";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import type { DistributorSale } from "../../types/sale.type";
import { formatDate, formatToPeso } from "../../utils/helpers";
import CustomTable from "../../components/ui/Table";
import { useDebounce } from "../../hooks/useDebounce";
import SalesControls from "../../components/sales/SalesControls";
import Chip from "../../components/ui/Chip";
import DistributorSalesModal from "../../components/sales/DistributorSalesModal";

export default function Sales () {
    const [sorting, setSorting] = useState<SortOption>({
        order: 'desc',
        sortBy: 'createdAt'
    });
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 800);
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [distributorSale, setDistributorSale] = useState<DistributorSale | null>(null);

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
            header: "Product",
            cell: ({ row }) => (
                <div className="min-w-50 flex gap-3 items-center">
                    <img 
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-md object-cover" 
                        src={row.original.variant.image_url} 
                        alt={row.original.variant.variant_name}
                    />
                    <h1>{row.original.product.product_name}</h1>
                </div>
            ),
            meta: { align: 'left' },
        },
        {
            header: "Variant",
            accessorKey: "variant.variant_name",
            cell: info => (
                <div className="min-w-60">
                    <Chip>{info.getValue() as string}</Chip>
                </div>
            ),
            meta: { align: 'center' },
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
            cell: (info) => <div className="min-w-30">{formatDate(info.getValue() as string)}</div>,
            meta: { align: 'center' }
        },
        {
            header: 'Commission',
            cell: ({ row }) => formatToPeso(row.original.total_amount * 0.05),
            meta: { align: 'center' }
        },
        {
            header: "Sales",
            accessorKey: 'total_amount',
            cell: info => <div className="font-bold min-w-30">{formatToPeso(info.getValue() as number)}</div>,
            meta: { align: 'center' }
        },
    ];

    const onRowClick = (row : DistributorSale) => setDistributorSale(row)

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-3 md:p-5">
            <DistributorSalesModal 
                distributorSale={distributorSale}
                close={() => setDistributorSale(null)}
            />
            <SalesControls 
                sorting={sorting}
                setSorting={setSorting}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                setSearch={setSearch}
                setPagination={setPagination}
            />
            <CustomTable
                isLoading={isFetching}
                data={data?.distributorSales || []}
                columns={columns}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages || 0}
                showPagination
                noDataMessage="No Sales Found"
                total={data?.pagination.total || 0}
                dataTour="sales-table"
                onRowClick={onRowClick}
            />
        </div>
    )
}