import { Search } from "lucide-react";
import TextField from "../ui/Textfield";
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { PaginationState } from "@tanstack/react-table";
import type { DistributorStock } from "../../types/stock.type";
import Button from "../ui/Button";
import Chip from "../ui/Chip";
import Card from "../ui/Card";
import { useDebounce } from "../../hooks/useDebounce";
import { useGetStocks } from "../../hooks/stock/use-get-stocks.hook";

interface ProductSelectionProps {
    setSelectedStock: Dispatch<SetStateAction<DistributorStock | null>>;
}

export default function ProductSelection({ setSelectedStock }: ProductSelectionProps) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 10,
        pageIndex: 0,
    });

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 800);

    const [stocks, setStocks] = useState<DistributorStock[]>([]);

    const { data, isFetching } = useGetStocks({
        search: debouncedSearch,
        limit: pagination.pageSize,
        page: pagination.pageIndex + 1,
        sortBy: "createdAt",
        order: "desc",
    });

    useEffect(() => {
        if (data) {
            setStocks((prev) => {
                if (data.pagination.page === 1) return data.distributorStocks;
                return [...prev, ...data.distributorStocks];
            });
        }
    }, [data]);

    const handleShowMore = () => {
        if (!data) return;

        if (data.pagination.page < data.pagination.totalPages) {
            setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
            }));
        }
    };

    const hasMore = useMemo(() => {
        return data && data.pagination.page < data.pagination.totalPages;
    }, [data]);

    const isInitialLoading = isFetching && pagination.pageIndex === 0;

    return (
        <>
            <h1 className="font-bold text-md md:text-lg">
                Select Product to Sponsor
            </h1>

            <TextField
                className="mt-10"
                icon={<Search className="text-gray-400" />}
                placeholder="Search by product name, variant name, sku..."
                onChange={(e) => {
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                    setSearch(e.target.value);
                }}
            />

            <div className="overflow-y-auto max-h-[40vh] space-y-3 p-3">
                {/* SKELETON LOADING */}
                {isInitialLoading && (
                    <>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <ProductSelectionSkeleton key={index} />
                        ))}
                    </>
                )}

                {!isInitialLoading &&
                    stocks.map((stock) => (
                        <Card key={stock._id} className="flex items-start gap-3">
                            <div className="w-15 h-15 bg-gray-200 rounded animate-pulse overflow-hidden">
                                <img
                                    className="w-full h-full object-cover"
                                    src={stock.variant.image_url}
                                    alt={stock.variant.variant_name}
                                />
                            </div>

                            <div className="space-y-2 flex-1">
                                <h1 className="text-sm">
                                    {stock.variant.product?.product_name}
                                </h1>

                                <Chip className="text-xs">
                                    {stock.variant.variant_name}
                                </Chip>

                                <p className="text-xs mt-3">
                                    Available Stock: {stock.quantity}
                                </p>

                                <p className="text-xs">
                                    SKU: {stock.variant.sku}
                                </p>

                                <Button
                                    className="px-4 py-2 text-xs"
                                    disabled={stock.quantity < 1}
                                    onClick={() => setSelectedStock(stock)}
                                >
                                    Select
                                </Button>
                            </div>
                        </Card>
                    ))}

                {/* SHOW MORE */}
                {hasMore && (
                    <div className="flex justify-center pt-3">
                        <Button
                            className="px-8 py-2 text-sm"
                            onClick={handleShowMore}
                            disabled={isFetching}
                        >
                            {isFetching ? "Loading..." : "Show More"}
                        </Button>
                    </div>
                )}

                {/* LOADING MORE SKELETON */}
                {isFetching && pagination.pageIndex > 0 && (
                    <>
                        {Array.from({ length: 2 }).map((_, index) => (
                            <ProductSelectionSkeleton key={`more-${index}`} />
                        ))}
                    </>
                )}
            </div>
        </>
    );
}

const ProductSelectionSkeleton = () => {
    return (
        <Card className="flex items-start gap-3 animate-pulse">
            <div className="w-15 h-15 bg-gray-300 rounded"></div>

            <div className="flex-1 space-y-2">
                <div className="w-[70%] h-4 bg-gray-300 rounded"></div>
                <div className="w-[40%] h-4 bg-gray-300 rounded"></div>
                <div className="w-[50%] h-3 bg-gray-300 rounded mt-3"></div>
                <div className="w-[60%] h-3 bg-gray-300 rounded"></div>
                <div className="w-[30%] h-8 bg-gray-300 rounded mt-2"></div>
            </div>
        </Card>
    );
};