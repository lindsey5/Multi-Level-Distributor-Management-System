import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import type { DistributorStock } from "../../types/stock.type";
import { formatToPeso } from "../../utils/helpers";
import { useGetStocks } from "../../hooks/stock/use-get-stocks.hook";
import { useMemo, useState } from "react";
import type { SortOption } from "../../types/types.type";
import { useDebounce } from "../../hooks/useDebounce";
import CustomTable from "../../components/ui/Table";
import InventoryControls from "../../components/inventory/InventoryControls";
import type { Variant } from "../../types/variant.type";
import EnterQuantity from "../../components/ui/EnterQuantity";
import Chip from "../../components/ui/Chip";
import ItemsToSell from "../../components/inventory/ItemsToSell";
import ItemsToReturn from "../../components/inventory/ItemsToReturn";
import { useSocket } from "../../hooks/useSocket";
import ModeToggle from "../../components/inventory/ModeToggle";
import ActionPanel from "../../components/inventory/ActionPanel";

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
    const debouncedSearch = useDebounce(search, 800);
    const [enableReturn, setEnableReturn] = useState(false);
    const socket = useSocket({
        namespace: "/notification",
        events: {}
    })

    const params = useMemo(() => ({
        search: debouncedSearch,
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        sortBy: sorting.sortBy,
        order: sorting.order
    }), [debouncedSearch, pagination, sorting])

    const { data, isFetching } = useGetStocks(params);

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
                <div className="min-w-50">
                    <Chip>{info.getValue() as string}</Chip>
                </div>
            ),
            meta: { align: 'center' }
        },
        {
            header: "Quantity",
            accessorKey: 'quantity',
            meta: { align: 'center' }
        },
        {
            header: "Price",
            cell: ({ row }) => (
                <div className="min-w-30">
                    {formatToPeso(row.original.variant.price)}
                </div>
            ),
            meta: { align: 'center' }
        },
    ];

    const onRowClick = (row : DistributorStock) => {
        setVariant({ ...row.variant, stock: row.quantity })
    }
    
    const handleClose = () => setShowModal(false);

return (
        <div className="flex flex-col min-h-0 gap-5 p-3 md:p-5">

            {/* MODE */}
            <ModeToggle
                enableReturn={enableReturn}
                setEnableReturn={setEnableReturn}
            />

            {/* MODAL */}
            <EnterQuantity
                open={variant !== null}
                close={() => setVariant(null)}
                setItems={setItems}
                variant={variant}
                buttonClassName={enableReturn ? "bg-red-600 border-none" : ""}
                buttonLabel={enableReturn ? "Return Item" : "Sell Item"}
                label={`Enter Quantity to ${enableReturn ? "return" : "sell"}`}
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

            {/* WORKSPACE */}
            <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">

                {/* LEFT - TABLE */}
                <div className="min-w-0 overflow-x-auto flex-1 flex flex-col min-h-0 gap-3">

                    <InventoryControls
                        setSearch={setSearch}
                        setSorting={setSorting}
                        sorting={sorting}
                        setPagination={setPagination}
                    />

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
                        onRowClick={onRowClick}
                    />

                </div>

                {/* RIGHT - PANEL */}
                <ActionPanel
                    items={items}
                    enableReturn={enableReturn}
                    onOpen={() => setShowModal(true)}
                />

            </div>
        </div>
    );
}