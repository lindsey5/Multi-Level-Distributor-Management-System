import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import type { DistributorStock } from "../../types/stock.type";
import { cn, formatDate, formatToPeso } from "../../utils/helpers";
import { useGetStocks } from "../../hooks/stock/use-get-stocks.hook";
import { useState } from "react";
import type { SortOption } from "../../types/types.type";
import { useDebounce } from "../../hooks/useDebounce";
import CustomTable from "../../components/ui/Table";
import InventoryControls from "../../components/inventory/InventoryControls";
import type { Variant } from "../../types/variant.type";
import Button from "../../components/ui/Button";
import EnterQuantity from "../../components/inventory/EnterQuantity";
import Chip from "../../components/ui/Chip";
import InventoryTour from "../../components/ui/Tour/InventoryTour";
import { 
    Package, 
    Undo2 
} from "lucide-react";
import ItemsToSell from "../../components/inventory/ItemsToSell";
import ItemsToReturn from "../../components/inventory/ItemsToReturn";
import { useSocket } from "../../hooks/useSocket";

export interface VariantWithQuantity extends Variant{
    quantity: number
}

export default function Inventory () {
    const [showModal, setShowModal] = useState(false);
    const [variant, setVariant] = useState<Variant | null>(null);
    const [items, setItems] = useState<VariantWithQuantity[]>([]);
    const [sorting, setSorting] = useState<SortOption>({
        order: 'desc',
        sortBy: 'createdAt'
    })
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 200);
    const [enableReturn, setEnableReturn] = useState(false);
    const socket = useSocket({
        namespace: "/notification",
        events: {}
    })

    const { data, isFetching } = useGetStocks({
        search: debouncedSearch,
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        sortBy: sorting.sortBy,
        order: sorting.order
    });

    const columns: ColumnDef<DistributorStock>[] = [
        {
            header: "Product",
            cell: ({ row }) => (
                <div className="min-w-50 flex gap-3 items-center">
                    <img 
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-md object-cover" 
                        src={row.original.variant.image_url} 
                        alt={row.original.variant.variant_name}
                    />
                    <h1>{row.original.variant.product?.product_name}</h1>
                </div>
            ),
            meta: { align: 'left' },
        },
        {
            header: "Variant",
            accessorKey: 'variant.variant_name',
            cell: info => (
                <div className="min-w-80">
                    <Chip>{info.getValue() as string}</Chip>
                </div>
            ),
            meta: { align: 'center' }
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
            header: 'Date Created',
            accessorKey: 'createdAt',
            cell: info => (
                <div className="min-w-50">
                    {formatDate(info.getValue() as string)}
                </div>
            ),
            meta: { align: 'center' }
        },
        {
            header: 'Action',
            cell: ({ row }) => (
                <>
                {enableReturn ? 
                    <Button 
                        data-tour="inventory-sell-btn"
                        className="flex gap-2 items-center py-1 text-xs bg-red-600 border-none"
                        onClick={() => setVariant({ ...row.original.variant, stock: row.original.quantity })}
                    >
                        <Undo2 size={18}/>
                        Return
                    </Button>
                    :
                    <Button 
                        data-tour="inventory-sell-btn"
                        className="py-1 text-xs"
                        onClick={() => setVariant({ ...row.original.variant, stock: row.original.quantity })}
                    >Sell</Button>
                }
                </>
            )
        }
    ];
    
    const handleClose = () => setShowModal(false);

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-5">
            <InventoryTour />
            <div className="flex gap-3 items-center" data-tour="inventory-mode-controls">
                <Button 
                    className={cn(
                        "flex gap-2 px-6 py-2 text-black bg-white border border-gray-300 shadow-none",
                        !enableReturn && 'bg-black text-white'
                    )}
                    onClick={() => setEnableReturn(prev => !prev)}
                >
                    <Package size={20} />
                    Sell Items
                </Button>
                <Button 
                    className={cn(
                        "flex gap-2 px-6 py-2 text-black bg-white border border-gray-300 shadow-none",
                        enableReturn && 'bg-black text-white'
                    )}
                    onClick={() => setEnableReturn(prev => !prev)}
                >
                    <Undo2 size={20} />
                    Return Items
                </Button>
            </div>
            <InventoryControls 
                setSearch={setSearch}
                setSorting={setSorting}
                sorting={sorting}
                setPagination={setPagination}
            />
            <EnterQuantity 
                open={variant !== null}
                close={() => setVariant(null)}
                setItems={setItems}
                variant={variant}
                mode={enableReturn ? 'return' : 'sell'}
            />
            {enableReturn ? (
                <ItemsToReturn
                    open={showModal}
                    close={handleClose}
                    items={items}
                    setItems={setItems}
                    socket={socket}
                />
            ) : (
                <ItemsToSell
                    open={showModal}
                    close={handleClose}
                    items={items}
                    setItems={setItems}
                    socket={socket}
                />
            )}
            <div className="relative flex justify-end">
                <Button 
                    className={cn(
                        "text-xs md:text-sm py-2 px-4 relative",
                        enableReturn && 'bg-red-600 border border-red-600'
                    )}
                    onClick={() => setShowModal(true)}
                    data-tour="inventory-selected-items"
                >
                    {enableReturn ? 'Items To Return' : 'Items To Sell'}
                    {items.length > 0 && (
                        <span className={cn(
                            "absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full",
                            enableReturn && 'bg-black'
                        )}>
                            {items.length}
                        </span>
                    )}
                </Button>
            </div>
            <CustomTable
                dataTour="inventory-table"
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