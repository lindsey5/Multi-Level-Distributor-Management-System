import { useMutation } from "@tanstack/react-query";
import type { CreateSponsoredItemPayload } from "../../types/sponsored-item.type";
import { sponsoredItemService } from "../../services/sponsoredItemService";

export const useCreateSponsoredItem = () => {
    return useMutation({
        mutationFn: (data: CreateSponsoredItemPayload) =>
            sponsoredItemService.createSponsoredItem(data)
    });
};