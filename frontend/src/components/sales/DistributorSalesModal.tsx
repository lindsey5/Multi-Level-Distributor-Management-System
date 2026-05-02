import Card from "../ui/Card";
import Chip from "../ui/Chip";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import type { DistributorSale } from "../../types/sale.type";
import { formatDate, formatToPeso } from "../../utils/helpers";

interface DistributorSalesModalProps {
    distributorSale: DistributorSale | null;
    close: () => void;
}

export default function DistributorSalesModal({ close, distributorSale }: DistributorSalesModalProps) {
        console.log(distributorSale)
    return (
        <Modal open={distributorSale !== null} onClose={close}>
            <Card className="space-y-5">
                <h1 className="font-bold text-md md:text-lg">Sales Details</h1>

                <div className="space-y-2 border-b border-[var(--border-panel)] pb-4">
                    <h2 className="font-semibold">Seller:</h2>
                    <p className="text-sm">{distributorSale?.seller?.distributor_name || "N/A"}</p>
                    <p className="text-xs text-muted">{distributorSale?.seller?.email || ""}</p>
                    <p className="text-xs font-bold">ID: {distributorSale?.seller.distributor_id}</p>
                </div>

                <div className="space-y-2">
                    <h2 className="font-semibold">Item:</h2>

                    <div className="flex gap-5 items-start">
                        <img
                            className="w-24 h-24 object-cover rounded-md border border-[var(--border-panel)]"
                            src={distributorSale?.variant?.image_url}
                            alt={distributorSale?.variant?.variant_name}
                        />

                        <div className="space-y-2 flex-1">
                            <div className="space-y-2">
                                <h1 className="font-bold text-sm md:text-md">
                                    {distributorSale?.product?.product_name}
                                </h1>
                                <Chip className="text-sm">{distributorSale?.variant?.variant_name}</Chip>
                            </div>

                            <p className="text-sm">Qty Sold: {distributorSale?.quantity}</p>
                            <p className="text-sm font-semibold">
                                Total Amount: {formatToPeso(distributorSale?.total_amount || 0)}
                            </p>

                            <p className="text-xs text-muted">
                                Date Sold: {formatDate(distributorSale?.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-5">
                     <h1 className="font-bold text-sm md:text-md">Commissions</h1>
                     <div className="flex justify-between items-center border border-[var(--border-ui)] px-3 py-2 rounded-lg">
                        <div className="space-y-1">
                            <h2 className="font-semibold text-sm">Seller:</h2>
                            <p className="text-sm">{distributorSale?.seller?.distributor_name || "N/A"}</p>
                            <p className="text-xs text-muted">{distributorSale?.seller?.email || ""}</p>
                            <p className="text-xs font-bold">ID: {distributorSale?.seller.distributor_id}</p>
                            <p className="text-xs">Commission Rate: {distributorSale?.commission_rate}%</p>
                        </div>
                        <p className="font-bold">{formatToPeso(distributorSale?.commission || 0)}</p>
                     </div>
                     {distributorSale?.parent_distributor && (
                        <div className="flex justify-between items-center border border-[var(--border-ui)] px-3 py-2 rounded-lg">
                            <div className="space-y-1">
                                <h2 className="font-semibold text-sm">Parent Distributor:</h2>
                                <p className="text-sm">{distributorSale?.parent_distributor?.distributor_name || "N/A"}</p>
                                <p className="text-xs text-muted">{distributorSale?.parent_distributor?.email || ""}</p>
                                <p className="text-xs font-bold">ID: {distributorSale?.parent_distributor?.distributor_id}</p>
                                <p className="text-xs">Commission Rate: {distributorSale.parent_commission_rate}%</p>
                            </div>
                            <p className="font-bold">{formatToPeso(distributorSale?.parent_commission || 0)}</p>
                        </div>
                     )}
                </div>
                <div className="flex justify-end">
                    <Button onClick={close}>Close</Button>
                </div>
            </Card>
        </Modal>
    );
}