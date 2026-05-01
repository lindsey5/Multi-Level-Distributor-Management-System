import { useEffect, useMemo, useState } from "react";
import { useGetStocks } from "../../hooks/stock/use-get-stocks.hook";
import { type PaginationState } from "@tanstack/react-table";
import { useDebounce } from "../../hooks/useDebounce";
import Chip from "../../components/ui/Chip";
import Button from "../../components/ui/Button";
import type { DistributorStock } from "../../types/stock.type";
import type { SortOption } from "../../types/types.type";
import StockOrderItemSkeleton from "../../components/stockOrder/StockOrderItemSkeleton";
import type { VariantWithQuantity } from "./Inventory";
import type { Variant } from "../../types/variant.type";
import EnterQuantity from "../../components/ui/EnterQuantity";
import { ShoppingCart } from "lucide-react";
import Cart from "../../components/stockOrder/Cart";
import { useSocket } from "../../hooks/useSocket";
import CreateStockOrderControls from "../../components/stockOrder/CreateStockOrderControls";

export default function StockOrder() {
    const socket = useSocket({
        namespace: "/notification",
        events: {},
    });

    const [showCart, setShowCart] = useState(false);
    const [cart, setCart] = useState<VariantWithQuantity[]>([]);
    const [variant, setVariant] = useState<Variant | null>(null);

    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 12,
        pageIndex: 0,
    });

    const [sorting, setSorting] = useState<SortOption>({
        order: "desc",
        sortBy: "createdAt",
    });

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 800);

    const [stocks, setStocks] = useState<DistributorStock[]>([]);

    const { data, isFetching } = useGetStocks({
        search: debouncedSearch,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        order: sorting.order,
        sortBy: sorting.sortBy,
    });

    const hasNextPage = useMemo(() => {
        if (!data?.pagination) return false;

        return (
            pagination.pageIndex + 1 <
            (data.pagination.totalPages || 0)
        );
    }, [data, pagination]);

    useEffect(() => {
        if (!data?.distributorStocks) return;

        setStocks((prev) =>
            pagination.pageIndex === 0
                ? data.distributorStocks
                : [...prev, ...data.distributorStocks]
        );
    }, [data]);

    const loadMore = () => {
        if (isFetching || !hasNextPage) return;

        setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex + 1,
        }));
    };


    return (
        <div className="p-3 md:p-6 space-y-5">

            {/* CART MODAL */}
            <Cart
                close={() => setShowCart(false)}
                items={cart}
                open={showCart}
                setItems={setCart}
                socket={socket}
            />

            {/* ENTER QUANTITY */}
            <EnterQuantity
                close={() => setVariant(null)}
                buttonLabel="Add to Cart"
                label="Select Quantity"
                open={variant !== null}
                setItems={setCart}
                variant={variant}
                showPrice={false}
            />

            {/* CONTROLS */}
            <CreateStockOrderControls
                setPagination={setPagination}
                setSearch={setSearch}
                setSorting={setSorting}
                sorting={sorting}
            />

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">

                {stocks.map((stock) => (
                    <div
                        key={stock._id}
                        className="group bg-white border border-gray-200 rounded-xl p-3 flex flex-col gap-2 hover:shadow-md transition"
                    >
                        {/* IMAGE */}
                        <div className="h-28 md:h-36 flex items-center justify-center">
                            <img
                                src={stock.variant.image_url}
                                alt={stock.variant.variant_name}
                                className="max-h-full object-contain group-hover:scale-105 transition"
                            />
                        </div>

                        {/* PRODUCT NAME */}
                        <h2 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2">
                            {stock.variant.product?.product_name}
                        </h2>

                        {/* VARIANT */}
                        <Chip className="w-fit text-[10px] md:text-xs">
                            {stock.variant.variant_name}
                        </Chip>

                        {/* STOCK INFO */}
                        <div className="text-[11px] md:text-xs text-gray-500 space-y-1">
                            <p>Your Stock: {stock.quantity}</p>
                            <p>Available: {stock.variant.stock}</p>
                        </div>

                        {/* ACTION */}
                        <Button
                            onClick={() => setVariant(stock.variant)}
                            className="w-full py-2 text-xs md:text-sm mt-auto"
                        >
                            Add to Cart
                        </Button>
                    </div>
                ))}

                {/* LOADING SKELETON */}
                {isFetching && <StockOrderItemSkeleton />}
            </div>

            {/* LOAD MORE */}
            {hasNextPage && (
                <div className="flex justify-center pt-4">
                    <Button
                        onClick={loadMore}
                        disabled={isFetching}
                        className="px-6 py-2 text-sm"
                    >
                        {isFetching ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}

            <Button
                onClick={() => setShowCart(true)}
                className="
                    fixed z-10
                    w-40 bg-gold
                    flex justify-center items-center gap-2
                    rounded-full shadow-lg

                    right-4 bottom-4
                    border-none
                    md:right-10 md:bottom-10
                    hover:bg-gold/90 hover:opacity-100
                "
            >
                <ShoppingCart size={20} />

                <span>
                    Your Cart
                </span>

                {cart.length > 0 && (
                    <span className="
                        absolute -top-2 -right-2
                        w-5 h-5 md:w-6 md:h-6
                        bg-red-500 text-white
                        rounded-full
                        flex items-center justify-center
                        shadow
                    ">
                        {cart.length}
                    </span>
                )}
            </Button>
        </div>
    );
}