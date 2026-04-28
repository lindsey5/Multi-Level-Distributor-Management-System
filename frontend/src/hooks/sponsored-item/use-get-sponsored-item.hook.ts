import { useQuery } from "@tanstack/react-query";
import type { GetSponsoredItemResponse } from "../../types/sponsored-item.type";
import { sponsoredItemService } from "../../services/sponsoredItemService";

export const useGetSponsoredItemById = (id : string) => (
    useQuery<GetSponsoredItemResponse, Error>({
        queryKey: [`sponsored-items/${id}`],
        queryFn: () => sponsoredItemService.getSponsoredItemById(id),
        refetchOnWindowFocus: false,
    })
)