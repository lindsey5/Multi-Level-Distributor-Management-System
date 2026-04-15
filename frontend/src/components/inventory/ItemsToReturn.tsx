import { useMemo, useState, type SetStateAction } from "react";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import type { VariantWithQuantity } from "../../pages/Dashboard/Inventory";
import { Minus, Plus, Undo2, X } from "lucide-react";
import { formatToPeso } from "../../utils/helpers";
import Button from "../ui/Button";
import { promiseToast } from "../../utils/sileo";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../lib/features/store";
import { authService } from "../../services/authService";
import { setAuth } from "../../lib/features/auth/authSlice";
import Chip from "../ui/Chip";
import { useCreateReturnRequest } from "../../hooks/returnRequest/use-create-return-request.hook";
import TextField from "../ui/Textfield";
import Dropdown from "../ui/Dropdown";
import { useSocket } from "../../hooks/useSocket";

interface ItemsToReturnProps{
    items: VariantWithQuantity[];
    setItems: React.Dispatch<SetStateAction<VariantWithQuantity[]>>;
    open: boolean;
    close: () => void;
}

const returnReasons = [
    "Damaged Item",
    "Wrong Item Delivered",
    "Others",
];

export default function ItemsToReturn ({ open, close, items, setItems } : ItemsToReturnProps) {
    const createReturnMutation = useCreateReturnRequest();
    const { distributor, refreshToken } = useSelector((store : RootState) => store.auth);
    const dispatch = useDispatch();
    const socket = useSocket({
        namespace: "/notification",
        events: {}
    })
    const [reason, setReason] = useState(returnReasons[0]);
    const [otherReason, setOtherReason] = useState("");

    const handleReturnItems = async () => {
        const isConfirmed = confirm(`Are you sure you want to return ${items.length} item(s)?`);

        if (!isConfirmed) return;

        const itemsToReturn = items.map(item => ({
            variant_id: item._id,
            quantity: item.quantity,
        }));
        const finalReason = reason === "Others" ? otherReason : reason;

        const data = await promiseToast(createReturnMutation.mutateAsync({ 
            data: {
                items: itemsToReturn,
                reason: finalReason,
        }}));

        if(socket){
            const response = await authService.refreshAccessToken(refreshToken || "");

            dispatch(setAuth({
                accessToken: response.token.accessToken, 
                refreshToken: response.token.refreshToken,
                distributor: response.distributor
            }))

            socket.emit("send-return-notification", {
                distributor_id: data.returnRequest.distributor_id,
                distributor_name: distributor?.distributor_name,
                returnRequest: data.returnRequest
            })
        }

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

    const handleRemove = (id: string) => {
        setItems(prev => prev.filter(item => item._id !== id));
    }


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
                    <h1 className="font-bold">Items to Return</h1>
                    <button className="cursor-pointer" onClick={close}>
                        <X size={20}/>
                    </button>
                </div>
                <div className="max-h-[30vh] overflow-y-auto">
                {items?.map(item => (
                    <div key={item._id} className="flex flex-col md:flex-row justify-between items-start gap-3 py-2 border-b border-gray-300">
                        <div className="flex flex-col md:flex-row gap-3">
                            <img className="w-15 h-15 md:w-18 md:h-18" src={item.image_url} alt="item-image"/>
                            <div className="space-y-1">
                                <p className="font-semibold mb-2 text-sm">{item.product?.product_name}</p>
                                <Chip className="text-xs">{item.variant_name}</Chip>
                                <p className="text-sm mt-4">Stock: {item.stock}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, -1)}
                                        disabled={item.quantity <= 1}
                                        className="disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <Minus size={18}/>
                                    </button>
                                    <input 
                                        type="number"
                                        onKeyDown={(e) => {
                                            if (e.key === "." || e.key === "," || e.key === "e" || e.key === "-") {
                                            e.preventDefault();
                                            }
                                        }}
                                        className="border border-gray-400 text-center w-15"
                                        value={item.quantity ? item.quantity : ""}
                                        onChange={(e) => handleQuantity(Number(e.target.value), item)}
                                    />
                                    <button
                                        onClick={() => updateQuantity(item._id, 1)}
                                        disabled={item.quantity >= item.stock}
                                        className="disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        <Plus size={18}/>
                                    </button>
                                </div>
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
                    <>
                    <Dropdown 
                        label="Reason for returning"
                        options={returnReasons.map(reason => ({ label: reason, value: reason }))}
                        onChange={(value) => setReason(value as string)}
                    />
                    {reason === "Others" && (
                        <TextField 
                            label="Other Reason"
                            placeholder="Enter reason"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                        />
                    )}
                    </>
                )}
                <div className="flex justify-end">
                    <Button
                        disabled={
                            items.length === 0 || 
                            createReturnMutation.isPending || 
                            !isValidItems ||
                            (!reason || (reason === "Others" && !otherReason))
                        }
                        className="py-2 px-5 mt-2 flex gap-2"
                        onClick={handleReturnItems}
                    >
                        <Undo2 size={20}/>
                        {createReturnMutation.isPending ? "Loading..." : "Request Return"}
                    </Button>
                </div>
            </Card>
        </Modal>
    )
}