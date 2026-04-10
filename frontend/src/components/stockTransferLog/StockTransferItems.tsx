import type { StockTransferLog } from "../../types/stock-transfer.type";
import { formatDate, formatToPeso } from "../../utils/helpers";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Chip from "../ui/Chip";
import Modal from "../ui/Modal";

interface StockTransferItemsProps {
    open: boolean;
    close: () => void;
    stockTransferLog: StockTransferLog | null;
}

export default function StockTransferItems ({ open, close, stockTransferLog } : StockTransferItemsProps) {

    return (
        <Modal open={open} onClose={close}>
            <Card className="">
                <h2 className="text-md font-semibold mb-3">Transfered Items</h2>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                {stockTransferLog?.items.map(item => (
                        <div
                            key={item.variant._id}
                            className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3 border-b border-gray-300 py-3"
                        >
                            <img
                                src={item.variant.image_url}
                                alt={item.variant.variant_name}
                                className="w-14 h-14 object-cover rounded"
                            />

                            <div className="flex-1">
                                <p className="font-medium text-sm">
                                    {item.variant.product?.product_name}
                                </p>
                                <Chip className="text-xs">{item.variant.variant_name}</Chip>
                                <p className="text-sm text-gray mt-3">
                                    {formatToPeso(item.variant.price)}
                                </p>
                            </div>
                            <p className="text-sm font-semibold">
                                Quantity: {item.quantity}
                            </p>
                        </div>
                ))}
                </div>
                <h2 className="text-md font-semibold mt-4 mb-3">Transfer Details</h2>
                <div className="border border-gray-300 p-2 rounded-lg shadow-lg">
                    <p className="text-sm">Sent by: {`${stockTransferLog?.sender?.firstname} ${stockTransferLog?.sender?.lastname}`}</p>
                    <p className="text-sm">Date: {formatDate(stockTransferLog?.createdAt)}</p>
                </div>
                <div className="flex justify-end mt-4">
                    <Button
                        className="text-sm py-2"
                        onClick={close}
                    >Close</Button>
                </div>
            </Card>
        </Modal>
    )
}