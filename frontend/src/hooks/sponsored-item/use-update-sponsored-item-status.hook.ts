import { useMutation } from "@tanstack/react-query";
import { sponsoredItemService } from "../../services/sponsoredItemService";

export const useUpdateSponsoredItemStatus = () => {
    return useMutation({
        mutationFn: ({ id, status } : { id: string; status: string }) =>
            sponsoredItemService.updateSponsoredItemStatus(id, status)
    });
};