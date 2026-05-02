import { useMemo, useState, type SetStateAction } from "react";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import type { VariantWithQuantity } from "../../pages/Dashboard/Inventory";
import { Undo2, X } from "lucide-react";
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
import type { Socket } from "socket.io-client";

interface ItemsToReturnProps{
    items: VariantWithQuantity[];
    setItems: React.Dispatch<SetStateAction<VariantWithQuantity[]>>;
    open: boolean;
    close: () => void;
    socket: Socket | null;
}

const returnReasons = [
    "Damaged Item",
    "Wrong Item Delivered",
    "Others",
];

export default function ItemsToReturn ({ 
    open, 
    close, 
    items, 
    setItems, 
    socket,
} : ItemsToReturnProps) {
    const createReturnMutation = useCreateReturnRequest();
    const { distributor, refreshToken } = useSelector((store : RootState) => store.auth);
    const dispatch = useDispatch();
    const [reason, setReason] = useState(returnReasons[0]);
    const [otherReason, setOtherReason] = useState("");

    const handleReturnItems = async () => {
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

        if(socket && data.returnRequest){
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
                    <div key={item._id} className="flex flex-col md:flex-row gap-3">
                        <img className="w-15 h-15 md:w-18 md:h-18" src={item.image_url} alt="item-image"/>
                        <div className="space-y-1">
                            <p className="font-semibold mb-2 text-sm">{item.product?.product_name}</p>
                            <Chip className="text-xs">{item.variant_name}</Chip>
                            <p className="text-sm mt-4">Quantity: {item.quantity}</p>
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
                        className="py-2 px-5 mt-2 flex gap-2 bg-red-600 border-none"
                        onClick={handleReturnItems}
                    >
                        <Undo2 size={20}/>
                        {createReturnMutation.isPending ? "Loading..." : "Return"}
                    </Button>
                </div>
            </Card>
        </Modal>
    )
}