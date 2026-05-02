import { useMemo } from "react";
import type { DistributorSale } from "../../types/sale.type";
import { formatDate, formatToPeso } from "../../utils/helpers";
import Card from "../ui/Card";
import Chip from "../ui/Chip";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function SaleItems ({ sales, close, open } : { open: boolean, sales: DistributorSale[] | null, close: () => void }) {
    
    const totalSales = useMemo(() => {
        if(!sales) return 0;

        return sales.reduce((total, sale) => total + sale.total_amount, 0);
    }, [sales])

    const totalCommission = useMemo(() => {
        if(!sales) return 0;

        return sales.reduce((total, sale) => total + sale.parent_commission, 0);
    }, [totalSales]);

    return (
        <Modal open={open} onClose={close}>
            <Card className="space-y-3">
                <div className="space-y-2 border-b border-[var(--border-panel)] pb-4">
                    <h2 className="font-semibold">Seller:</h2>
                    <p className="text-sm">{sales?.[0]?.seller.distributor_name || "N/A"}</p>
                    <p className="text-xs text-muted">{sales?.[0]?.seller.email || ""}</p>
                    <p className="text-xs font-bold">ID: {sales?.[0]?.seller.distributor_id}</p>
                </div>
                <h2 className="font-semibold">Items:</h2>
                <div className="max-h-[50vh] overflow-y-auto space-y-5">
                    {sales?.map(sale => (
                        <SaleItem sale={sale}/>
                    ))}
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-gray-300">
                    <p className="text-sm">Total Sales: </p>
                    <p className="text-sm">{formatToPeso(totalSales)}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-md font-semibold">Total Commission: </p>
                    <p className="text-md font-bold">{formatToPeso(totalCommission)}</p>
                </div>
                <div className="flex justify-end">
                    <Button
                        className="py-2 px-6"
                        onClick={close}
                    >Close</Button>
                </div>
            </Card>
        </Modal>
    )
}


function SaleItem ({ sale } : {sale : DistributorSale}) {

    return (
        <div className="flex gap-5 items-start">
            <img
                className="w-24 h-24 object-cover rounded-md border border-[var(--border-panel)]"
                src={sale.variant.image_url}
                alt={sale.variant.variant_name}
            />

            <div className="space-y-2 flex-1">
                <div className="space-y-2">
                    <h1 className="font-bold text-sm md:text-md">
                        {sale.variant?.product?.product_name}
                    </h1>
                    <Chip className="text-sm">{sale.variant.variant_name}</Chip>
                </div>

                <p className="text-sm text-muted">Qty Sold: {sale.quantity}</p>
                <p className="text-sm text-muted">Sales: {formatToPeso(sale.total_amount || 0)}</p>

                <p className="text-xs text-muted">Date Sold: {formatDate(sale.createdAt)}</p>
                <p className="text-xs font-semibold">Your Commision ({sale.parent_commission_rate}% of total sales): {formatToPeso(sale.parent_commission)}</p>
            </div>
        </div>
    )
}