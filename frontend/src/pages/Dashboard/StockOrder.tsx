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
        events: {}
    })
    const [showCart, setShowCart] = useState(false);
    const [cart, setCart] = useState<VariantWithQuantity[]>([]);
    const [variant, setVariant] = useState<Variant | null>(null);

    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 12,
        pageIndex: 0,
    });
    const [sorting, setSorting] = useState<SortOption>({
        order: 'desc',
        sortBy: 'createdAt'
    })
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 800);
    const [stocks, setStocks] = useState<DistributorStock[]>([]);

    const { data, isFetching } = useGetStocks({
        search: debouncedSearch,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        order: sorting.order,
        sortBy: sorting.sortBy
    });

    const hasNextPage = useMemo(() => {
        if(!data?.distributorStocks) return false;

        return (
            (pagination.pageIndex + 1) <
            (data?.pagination?.totalPages || 0)
        );
    }, [data, pagination]);

    // Append data
    useEffect(() => {
        if (!data?.distributorStocks) return;

        setStocks((prev) => pagination.pageIndex === 0 ? data.distributorStocks : [...prev, ...data.distributorStocks]);
    }, [data]);

    const loadMore = () => {
        if (isFetching || !hasNextPage) return;

        setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex + 1,
        }));
    };

    return (
        <div className="p-3 md:p-5 space-y-5">
            <Cart 
                close={() => setShowCart(false)}
                items={cart}
                open={showCart}
                setItems={setCart}
                socket={socket}
            />
            <EnterQuantity 
                close={() => setVariant(null)}
                buttonLabel="Add to Cart"
                label="Enter Quantity"
                open={variant !== null}
                setItems={setCart}
                variant={variant}
                showPrice={false}
            />
            <div className="flex items-center justify-end">
                <Button 
                    className="py-2 px-8 flex items-center gap-2 relative"
                    onClick={() => setShowCart(true)}
                >
                    <ShoppingCart size={20} />
                    <p className="text-xs md:text-base">Cart</p>
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {cart.length}
                        </span>
                    )}
                </Button>
            </div>

            <CreateStockOrderControls 
                setPagination={setPagination}
                setSearch={setSearch}
                setSorting={setSorting}
                sorting={sorting}
            />

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-5">
                {stocks.map((stock) => (
                    <div
                        key={stock._id}
                        className="flex flex-col items-center space-y-3 border border-gray-300 rounded-lg shadow-lg p-4"
                    >
                        <img
                            className="w-full h-15 md:h-36 object-contain"
                            src={stock.variant.image_url}
                            alt={stock.variant.variant_name}
                        />

                        <h1 className="text-center font-semibold text-xs md:text-sm line-clamp-2">
                            {stock.variant.product?.product_name}
                        </h1>

                        <Chip className="text-[10px] md:text-sm">
                            {stock.variant.variant_name}
                        </Chip>

                        <p className="text-start w-full text-xs md:text-sm text-gray-600">
                            Your Stock: {stock.quantity}
                        </p>

                        <p className="text-start w-full text-xs md:text-sm text-gray-600">
                            Available Stock: {stock.variant.stock}
                        </p>

                        <Button className="w-full px-1 py-2 text-[10px] md:text-sm" onClick={() => setVariant(stock.variant)}>
                            Add to Cart
                        </Button>
                    </div>
                ))}
                {isFetching && <StockOrderItemSkeleton />}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
                <div className="flex justify-center pt-5">
                    <Button
                        onClick={loadMore}
                        disabled={isFetching}
                        className="px-6 py-2"
                    >
                        {isFetching ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}
        </div>
    );
}