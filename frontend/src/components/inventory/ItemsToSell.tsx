import { useContext, useMemo, type SetStateAction } from "react";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import type { VariantWithQuantity } from "../../pages/Dashboard/Inventory";
import { Minus, Plus, X } from "lucide-react";
import { formatToPeso } from "../../utils/helpers";
import Button from "../ui/Button";
import { useCreateSales } from "../../hooks/sale/use-create-sales.hook";
import { promiseToast } from "../../utils/sileo";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../lib/features/store";
import { authService } from "../../services/authService";
import { setAuth } from "../../lib/features/auth/authSlice";
import Chip from "../ui/Chip";
import type { Socket } from "socket.io-client";
import { DistributorNotificationSocketContext } from "../../contexts/DistributorNotificationSocket";
import QuantitySelector from "./QuantitySelector";

interface ItemsToSellProps{
    items: VariantWithQuantity[];
    setItems: React.Dispatch<SetStateAction<VariantWithQuantity[]>>;
    open: boolean;
    close: () => void;
    socket: Socket | null;
    updateQuantity: (variantId: string, quantity: number) => void;
    handleRemove: (id : string) => void;
}

export default function ItemsToSell ({ 
    open, 
    close, 
    items, 
    setItems, 
    socket,
    handleRemove,
    updateQuantity,
} : ItemsToSellProps) {
    const createSalesMutation = useCreateSales();
    const { distributor, refreshToken } = useSelector((store : RootState) => store.auth);
    const dispatch = useDispatch();
    const { socket : distributorNotificationSocket } = useContext(DistributorNotificationSocketContext);

    const handleSellItems = async () => {
        const itemsToSell = items.map(item => ({
            variant_id: item._id,
            quantity: item.quantity,
            total_amount: item.quantity * item.price
        }));

        const data = await promiseToast(createSalesMutation.mutateAsync({ data: itemsToSell }));

        if(socket && data.sales){
            const response = await authService.refreshAccessToken(refreshToken || "");

            dispatch(setAuth({
                accessToken: response.token.accessToken, 
                refreshToken: response.token.refreshToken,
                distributor: response.distributor
            }))

            socket.emit("send-sale-notification", {
                distributor_id: data.sales[0].seller_id,
                distributor_name: distributor?.distributor_name,
                sales: data.sales
            })

            distributorNotificationSocket?.emit("parent-distributor-sale-notification", {
                distributor_id: data.sales[0].seller_id,
                sales: data.sales
            })
        }

        setItems([]);
    };

    const totalAmount = useMemo(() => {
        return items.reduce((total, item) => (item.price * item.quantity) + total, 0)
    }, [items])

    const commission = useMemo(() => {
        return totalAmount * 0.05;
    }, [totalAmount])

    const handleQuantity = (quantity : number, variant: VariantWithQuantity) => {
        if(quantity <= variant.stock){
            setItems(prev => 
                prev.map(item => 
                    item._id === variant._id ? ({ ...item, quantity }) : 
                    item
                )
            )
        }
    }

    const isValidItems = useMemo(() => {
        return items.every(item => item.quantity);
    }, [items])
    
    return (
        <Modal className="max-w-[90vw] md:max-w-120" open={open} onClose={close}>
            <Card className="flex flex-col gap-3">
                <div className="flex justify-between mb-2">
                    <h1 className="font-bold">Items to Sell</h1>
                    <button className="cursor-pointer" onClick={close}>
                        <X size={20}/>
                    </button>
                </div>
                <div className="max-h-[40vh] overflow-y-auto">
                {items?.map(item => (
                    <div key={item._id} className="flex flex-col md:flex-row justify-between items-start gap-3 py-2 border-b border-gray-300">
                        <div className="flex flex-col md:flex-row gap-3">
                            <img className="w-15 h-15 md:w-18 md:h-18" src={item.image_url} alt="item-image"/>
                            <div className="space-y-1">
                                <p className="font-semibold mb-2 text-sm">{item.product?.product_name}</p>
                                <Chip className="text-xs">{item.variant_name}</Chip>
                                <p className="text-sm mt-4">Available Stock: {item.stock}</p>
                                <QuantitySelector updateQuantity={updateQuantity} item={item}/>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm font-semibold">{formatToPeso(item.price * item.quantity)}</p>
                            <button
                                className="shadow-md shadow-gray-400 cursor-pointer text-sm bg-red-500 px-3 py-1 mt-2 text-white rounded-md"
                                onClick={() => handleRemove(item._id)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
                </div>
                {items.length === 0 ? <p className="w-full text-center">No Items</p> : (
                    <div className="flex flex-col items-end gap-2">
                        <p className="text-xs md:text-sm">
                            <span className="font-semibold">Total Sales:</span>{" "}
                            {formatToPeso(totalAmount)}
                        </p>

                        <p className="text-xs md:text-sm">
                            <span className="font-semibold">5% of Total Sales:</span>{" "}
                            {formatToPeso(totalAmount)} x 0.05
                        </p>

                        <p className="font-bold">
                            <span>Your Commission:</span>{" "}
                            {formatToPeso(commission)}
                        </p>
                    </div>
                )}
                <div className="flex justify-end">
                    <Button
                        disabled={items.length === 0 || createSalesMutation.isPending || !isValidItems}
                        className="py-2 px-6 mt-2"
                        onClick={handleSellItems}
                    >{createSalesMutation.isPending ? "Loading..." : "Proceed Sell"}</Button>
                </div>
            </Card>
        </Modal>
    )
}