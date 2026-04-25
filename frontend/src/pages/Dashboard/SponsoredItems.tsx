import { useState } from "react";
import { useGetSponsoredItems } from "../../hooks/sponsored-item/use-get-sponsored-items.hook"
import { useDebounce } from "../../hooks/useDebounce";
import type { PaginationState } from "@tanstack/react-table";

export default function SponsoredItems () {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 800);
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 50, pageIndex: 0 });
    
    const { data } = useGetSponsoredItems({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch,
        status,
        startDate,
        endDate
    });

    return (
        <div className="flex flex-col flex-1 min-h-0 gap-5 p-5">

        </div>
    )
}