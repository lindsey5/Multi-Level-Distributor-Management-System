import { useMemo } from "react";
import type { CommissionLog } from "../../types/commissionLog.type";
import { formatToPeso } from "../../utils/helpers";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Chip from "../ui/Chip";

interface CommissionLogProps {
    open: boolean;
    close: () => void;
    commissionLog: CommissionLog | null;
}

export default function CommissionLogModal ({ open, close, commissionLog } : CommissionLogProps) {

    const totalSales = useMemo(() => {
        if(!commissionLog) return 0;

        return commissionLog.sales.reduce((total, sale) => total + sale.total_amount, 0);

    }, [commissionLog])

    return (
        <Modal
            open={open}
            onClose={close}
        >
            <Card className="space-y-5">
                <h1 className="text-md md:text-lg font-bold">Commission Details</h1>
                <div className="border border-gray-300 p-3 rounded-lg shadow-md">
                    <h1 className="font-bold text-sm md:text-base mb-2">Seller</h1>
                    <p className="text-xs md:text-sm">{commissionLog?.sales[0].seller.distributor_name}</p>
                    <p className="text-xs md:text-sm">{commissionLog?.sales[0].seller.email}</p>
                    <p className="text-xs md:text-sm font-semibold">ID: {commissionLog?.sales[0].seller.distributor_id}</p>
                </div>
                <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                {commissionLog?.sales.map(sale => (
                    <div className="flex gap-3">
                        <img className="w-20 h-20" src={sale.variant.image_url} alt="" />
                        <div className="text-xs md:text-sm space-y-1">
                            <p className="my-3">{sale.variant.product?.product_name}</p>
                            <Chip className="text-xs">{sale.variant.variant_name}</Chip>
                            <p className="mt-3">Quantity Sold: {sale.quantity}</p> 
                            <p className="font-semibold">Sales: {formatToPeso(sale.total_amount)}</p>
                        </div>
                    </div>
                ))}
                </div>
                <div className="flex justify-end pt-5 border-t border-gray-300">
                    <div className="flex flex-col items-end gap-2">
                        <p className="text-xs md:text-sm">
                            <span className="font-semibold">Total Sales:</span>{" "}
                            {formatToPeso(totalSales)}
                        </p>

                        <p className="text-xs md:text-sm">
                            <span className="font-semibold">{commissionLog?.receiver_id === commissionLog?.sales[0].seller_id ? "5%" : "2%"} of Total Sales:</span>{" "}
                            {formatToPeso(totalSales)} x {commissionLog?.receiver_id === commissionLog?.sales[0].seller_id ? "0.05" : "0.02"}
                        </p>

                        <p className="font-bold">
                            <span>Your Commission:</span>{" "}
                            {formatToPeso(totalSales * (commissionLog?.receiver_id === commissionLog?.sales[0].seller_id ? 0.05 : 0.02))}
                        </p>
                        <Button
                            className="py-2 px-6 mt-2"
                            onClick={close}
                        >Close</Button>
                    </div>
                </div>
            </Card>
        </Modal>
    )
}