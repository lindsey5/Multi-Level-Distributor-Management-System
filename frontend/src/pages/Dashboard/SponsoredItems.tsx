import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useGetSponsoredItems } from "../../hooks/sponsored-item/use-get-sponsored-items.hook"
import { useDebounce } from "../../hooks/useDebounce";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import Button from "../../components/ui/Button";
import CreateSponsoredProduct from "../../components/sponsored-item/CreateSponsoredProduct";
import type { SponsoredItem } from "../../types/sponsored-item.type";
import CustomTable from "../../components/ui/Table";
import Chip from "../../components/ui/Chip";
import { formatDate } from "../../utils/helpers";
import DeliveryStatusChip from "../../components/ui/DeliveryChip";
import SponsoredItemControls from "../../components/sponsored-item/SponsoredItemControls";
import { useSearchParams } from "react-router-dom";
import SponsoredItemDetails from "../../components/sponsored-item/SponsoredItemDetails";
import { Eye } from "lucide-react";

const columns = (setSponsoredId : Dispatch<SetStateAction<string | null>>) : ColumnDef<SponsoredItem>[] =>  [
    {
        header: 'Sponsored ID',
        accessorKey: 'sponsored_id',
        cell: info => (
            <div className="min-w-30">
                {info.getValue() as string}
            </div>
        ),
        meta: { align: 'center' },
    },
    {
        header: "Product",
        cell: ({ row }) => (
            <div className="min-w-50 flex gap-3 justify-center items-center">
                <img 
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-md object-cover" 
                    src={row.original.variant.image_url} 
                    alt={row.original.variant.variant_name}
                />
                <h1>{row.original.variant.product?.product_name}</h1>
            </div>
        ),
        meta: { align: 'center' },
    },
    {
        header: "Variant",
        accessorKey: "variant.variant_name",
        cell: info => (
            <div className="min-w-40">
                <Chip>{info.getValue() as string}</Chip>
            </div>
        ),
        meta: { align: 'center' },
    },
    {
        header: "SKU",
        accessorKey: 'variant.sku',
        cell: info => (
            <div className="min-w-30">
                {info.getValue() as string}
            </div>
        ),
        meta: { align: 'center' }
    },
    {
        header: "Status",
        accessorKey: 'status',
        cell: (info) => <DeliveryStatusChip status={info.getValue() as string}/>,
     meta: { align: 'center' }
    },
    {
        header: 'Date',
        accessorKey: 'createdAt',
        cell: (info) => <div className="min-w-30">{formatDate(info.getValue() as string)}</div>,
        meta: { align: 'center' }
    },
    {
        header: 'Action',
        cell: ({ row }) => (
            <Button className="px-2 py-1" onClick={() => setSponsoredId(row.original._id)}>
                <Eye size={20} />
            </Button>
        ),
        meta: { align: 'center' },
    },
]

export default function SponsoredItems () {
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id");

    const [sponsoredId, setSponsoredId] = useState<string | null>(null);

    const [search, setSearch] = useState(id || "");
    const debouncedSearch = useDebounce(search, 800);
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    const [showModal, setShowModal] = useState(false);

    const { data, isFetching } = useGetSponsoredItems({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        status,
        startDate,
        endDate
    });

    const onRowClick = (row : SponsoredItem) => setSponsoredId(row._id)

    useEffect(() => {
        const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;

        const isReload = navEntry?.type === "reload";

        if (isReload && id) {
            setSearchParams({}, { replace: true });
        }
    }, [id]);

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-5">
            <CreateSponsoredProduct 
                close={() => setShowModal(false)}
                open={showModal}
            />
            <SponsoredItemDetails 
                close={() => setSponsoredId(null)}
                sponsoredId={sponsoredId}
            />
            <SponsoredItemControls 
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                setPagination={setPagination}
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
            />
            <CustomTable
                isLoading={isFetching}
                data={data?.sponsoredItems || []}
                columns={columns(setSponsoredId)}
                pagination={pagination}
                setPagination={setPagination}
                totalPages={data?.pagination.totalPages || 0}
                showPagination
                noDataMessage="No Sponsored Items Found"
                total={data?.pagination.total || 0}
                onRowClick={onRowClick}
            />

            <div className="flex justify-end">
                <Button onClick={() => setShowModal(true)}>Sponsor a Product</Button>
            </div>
        </div>
    )
}