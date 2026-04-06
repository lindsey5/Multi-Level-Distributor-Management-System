import type { SetStateAction } from "react";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import type { VariantWithQuantity } from "../../pages/Dashboard/Inventory";
import { Minus, Plus, X } from "lucide-react";
import { formatToPeso } from "../../utils/helpers";
import Button from "../ui/Button";
import { useCreateSales } from "../../hooks/sale/use-create-sales";
import { promiseToast } from "../../utils/sileo";

interface ItemsToSellProps{
    items: VariantWithQuantity[];
    setItems: React.Dispatch<SetStateAction<VariantWithQuantity[]>>;
    open: boolean;
    close: () => void;
}

export default function ItemsToSell ({ open, close, items, setItems } : ItemsToSellProps) {
    const createSalesMutation = useCreateSales();

    const handleSellItems = async () => {
        const isConfirmed = confirm(`Are you sure you want to sell ${items.length} item(s)?`);

        if (!isConfirmed) return;

        const itemsToSell = items.map(item => ({
            variant_id: item._id,
            quantity: item.quantity,
            total_amount: item.quantity * item.price
        }));

        await promiseToast(createSalesMutation.mutateAsync({ data: itemsToSell }));
        setItems([]);
    };

    const updateQuantity = (variantId: string, change: number) => {
        setItems(prev => prev.map(item => {
            if (item._id === variantId) {
                const newQty = Math.min(Math.max(item.quantity + change, 1), item.stock); // avoid <1 or >stock
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };
    
    return (
        <Modal open={open} onClose={close}>
            <Card className="flex flex-col gap-3">
                <div className="flex justify-between mb-2">
                    <h1 className="font-bold">Items to Sell</h1>
                    <button className="cursor-pointer" onClick={close}>
                        <X size={20}/>
                    </button>
                </div>
                <div className="max-h-[50vh] overflow-y-auto">
                {items?.map(item => (
                    <div key={item._id} className="flex justify-between items-start gap-3 py-2 border-b border-gray-300">
                        <div className="flex gap-3">
                            <img className="w-15 h-15 md:w-18 md:h-18" src={item.image_url} alt="item-image"/>
                            <div className="space-y-1">
                                <p className="font-semibold">{item.variant_name}</p>
                                <p className="text-sm">Available Stock: {item.stock}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm font-semibold">{formatToPeso(item.price * item.quantity)}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={() => updateQuantity(item._id, -1)}
                                    disabled={item.quantity <= 1}
                                    className="disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <Minus size={15}/>
                                </button>
                                <div className="bg-white border border-gray-300 px-2 text-sm">
                                    {item.quantity}
                                </div>
                                <button
                                    onClick={() => updateQuantity(item._id, 1)}
                                    disabled={item.quantity >= item.stock}
                                    className="disabled:cursor-not-allowed cursor-pointer"
                                >
                                    <Plus size={15}/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
                {items.length === 0 && <p className="w-full text-center">No Items</p>}
                <div className="flex justify-end">
                    <Button
                        disabled={items.length === 0 || createSalesMutation.isPending}
                        className="text-sm py-3"
                        onClick={handleSellItems}
                    >Sell Items</Button>
                </div>
            </Card>
        </Modal>
    )
}