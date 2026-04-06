import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import type { DistributorStock } from "../../types/stock.type";
import { formatDate, formatToPeso } from "../../utils/helpers";
import { useGetStocks } from "../../hooks/distributor/use-get-stocks.hook";
import { useState } from "react";
import type { SortOption } from "../../types/types.type";
import { useDebounce } from "../../hooks/useDebounce";
import CustomTable from "../../components/ui/Table";
import InventoryControls from "../../components/inventory/InventoryControls";
import ItemsToSell from "../../components/inventory/ItemsToSell";
import type { Variant } from "../../types/variant.type";
import Button from "../../components/ui/Button";
import EnterQuantity from "../../components/inventory/EnterQuantity";

export interface VariantWithQuantity extends Variant{
    quantity: number
}

export default function Inventory () {
    const [showModal, setShowModal] = useState(false);
    const [variant, setVariant] = useState<Variant | null>(null);
    const [items, setItems] = useState<VariantWithQuantity[]>([]);
    const [sorting, setSorting] = useState<SortOption>({
        order: 'desc',
        sortBy: 'updatedAt'
    })
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 200);

    const { data, isFetching } = useGetStocks({
        search: debouncedSearch,
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        sortBy: sorting.sortBy,
        order: sorting.order
    });

    const columns: ColumnDef<DistributorStock>[] = [
        {
            header: "Variant",
            accessorKey: "createdAt",
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
            header: "Price",
            cell: ({ row }) => formatToPeso(row.original.variant.price),
            meta: { align: 'center' }
        },
        {
            header: 'Updated At',
            accessorKey: 'updatedAt',
            cell: ({ row }) => formatDate(row.original.updatedAt),
            meta: { align: 'center' }
        },
        {
            header: 'Action',
            cell: ({ row }) => (
                <Button 
                    className="py-1 text-xs"
                    onClick={() => setVariant({ ...row.original.variant, stock: row.original.quantity })}
                >Sell</Button>
            )
        }
    ];

    const handleClose = () => setShowModal(false);

    return (
        <div className="h-screen flex flex-col gap-5 m-5">
            <div className="relative flex justify-end">
                <Button 
                    className="py-2 px-4 relative"
                    onClick={() => setShowModal(true)}
                >
                    Items To Sell
                    {items.length > 0 && (
                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {items.length}
                        </span>
                    )}
                </Button>
            </div>
            <InventoryControls 
                setSearch={setSearch}
                setSorting={setSorting}
                sorting={sorting}
            />
            <EnterQuantity 
                open={variant !== null}
                close={() => setVariant(null)}
                setItems={setItems}
                variant={variant}
            />
            <ItemsToSell 
                open={showModal}
                close={handleClose}
                items={items}
                setItems={setItems}
            />
            <CustomTable
                isLoading={isFetching}
                data={data?.distributorStocks || []}
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