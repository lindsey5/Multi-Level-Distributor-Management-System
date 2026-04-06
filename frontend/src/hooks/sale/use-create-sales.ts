import { useMutation } from "@tanstack/react-query";
import { saleService } from "../../services/saleService";
import type { CreateDistributorSalePayload } from "../../types/sale.type";

export const useCreateSales = () => {
    return useMutation({
        mutationFn: ({ data }: { data: CreateDistributorSalePayload[] }) =>
            saleService.createDistributorSales(data)
    });
};