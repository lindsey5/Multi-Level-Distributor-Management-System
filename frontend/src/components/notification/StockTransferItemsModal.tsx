import Modal from "../ui/Modal";
import Card from "../ui/Card";
import type { StockTransferLog } from "../../types/stock-transfer.type";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import Chip from "../ui/Chip";
import { formatToPeso } from "../../utils/helpers";
import { X } from "lucide-react";

interface StockTransferModal {
    stockTransfer: StockTransferLog | null;
    open: boolean;
    close: () => void;
}

const StockTransferItemsModal = ({ stockTransfer, open, close } : StockTransferModal) => {
    const navigate = useNavigate();

    const handleView = () => {
        navigate('/distributor/inventory');
        close();
    }

    return (
        <Modal
            open={open}
            onClose={close}
        >
            <Card className="flex flex-col gap-3">
                <div className="flex justify-between mb-2">
                    <h1 className="font-bold">Received Items</h1>
                    <button className="cursor-pointer" onClick={close}>
                        <X size={20}/>
                    </button>
                </div>
                <div className="max-h-[50vh] overflow-y-auto">
                {stockTransfer?.items?.map(item => (
                    <div key={item._id} className="flex gap-3 py-2 border-b border-gray-300">
                        <img className="w-15 h-15 md:w-20 md:h-20" src={item.variant.image_url} alt="item-image"/>
                        <div className="space-y-1">
                            <p className="font-semibold">{item.variant.product?.product_name}</p>
                            <Chip className="text-xs">{item.variant.variant_name}</Chip>
                            <p className="text-sm mt-2">Quantity: {item.quantity}</p>
                            <p className="text-sm">Price: {formatToPeso(item.variant.price)}</p>
                        </div>
                    </div>
                ))}
                </div>
                <div className="flex justify-end">
                    <Button
                        className="text-sm py-3"
                        onClick={handleView}
                    >Go to Inventory</Button>
                </div>
            </Card>
        </Modal>
    )
}

export default StockTransferItemsModal