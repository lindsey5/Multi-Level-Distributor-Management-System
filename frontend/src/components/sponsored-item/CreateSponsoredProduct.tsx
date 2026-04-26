import { useMemo, useState } from "react";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import type { DistributorStock } from "../../types/stock.type";
import Chip from "../ui/Chip";
import Button from "../ui/Button";
import TextField from "../ui/Textfield";
import ProductSelection from "./ProductSelection";
import { useCreateSponsoredItem } from "../../hooks/sponsored-item/use-create-sponsored-item.hook";
import { promiseToast } from "../../utils/sileo";
import { useSocket } from "../../hooks/useSocket";
import { authService } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../lib/features/store";
import { setAuth } from "../../lib/features/auth/authSlice";

interface CreateSponsoredProductProps {
    open: boolean;
    close: () => void;
}

export default function CreateSponsoredProduct ({ close, open } : CreateSponsoredProductProps) {
    const [selectedStock, setSelectedStock] = useState<DistributorStock | null>(null);
    const [quantity, setQuantity] = useState(0);
    const createSponsoredItemMutation = useCreateSponsoredItem();
    const { refreshToken } = useSelector((store : RootState) => store.auth);
    const dispatch = useDispatch();
    const socket = useSocket({ namespace: '/notification' });

    const handleSubmit = async () => {
        if(!selectedStock) return;

        const isConfirmed = confirm(
            `Are you sure you want to sponsor ${selectedStock.variant.product?.product_name} (${selectedStock.variant.variant_name})?`
        );
        if(!isConfirmed) return;

        const data = await promiseToast(createSponsoredItemMutation.mutateAsync({ quantity, variant_id: selectedStock.variant_id }));

        if(data.sponsoredItem && socket) {
            const response = await authService.refreshAccessToken(refreshToken || "");
            
            dispatch(setAuth({
                accessToken: response.token.accessToken, 
                refreshToken: response.token.refreshToken,
                distributor: response.distributor
            }))

            socket.emit("send-sponsored-item-notification", data.sponsoredItem);
        }
    }

    const { isExceedingStock, isInvalid, errorMessage } = useMemo(() => {
        const stock = selectedStock?.quantity || 0;

        const isExceedingStock = (quantity || 0) > stock;
        const isInvalid = (quantity || 0) <= 0;

        const errorMessage =
            stock === 0
                ? "No stock available"
                : isInvalid
                ? "Quantity is required"
                : isExceedingStock
                ? "Quantity exceeds available stock"
                : "";

        return {
            isExceedingStock,
            isInvalid,
            errorMessage,
        };
    }, [selectedStock?.quantity, quantity]);
    
    return (
        <Modal
            open={open}
            onClose={close}
        >
            <Card className="space-y-3">
                {!selectedStock ? (
                    <ProductSelection setSelectedStock={setSelectedStock}/>
                ) : (
                    <>
                    <h1 className="font-bold text-md md:text-lg">Selected Product</h1>
                    <div className="flex items-start gap-3 border-y py-3 border-gray-300">
                        <img 
                            className="w-15 h-15"
                            src={selectedStock.variant.image_url} 
                            alt={selectedStock.variant.variant_name} 
                        />
                        <div className="space-y-2">
                            <h1 className="text-sm">{selectedStock.variant.product?.product_name}</h1>
                            <Chip className="text-xs">{selectedStock.variant.variant_name}</Chip>
                            <p className="text-xs mt-3">Available Stock: {selectedStock.quantity}</p>
                            <p className="text-xs">SKU: {selectedStock.variant.sku}</p>
                            <Button className="px-4 py-2 text-xs" onClick={() => setSelectedStock(null)}>Change</Button>
                        </div>
                    </div>
                    <TextField
                        label="Quantity"
                        placeholder="Enter quantity"
                        type="number"
                        value={quantity ? quantity.toString() : ""}
                        onKeyDown={(e) => {
                            if (e.key === "." || e.key === "," || e.key === "e" || e.key === "-") {
                            e.preventDefault();
                            }
                        }}
                        onChange={(e) => setQuantity(Math.floor(Number(e.target.value)))}
                        error={errorMessage}
                    />
                    </>
                )}
                <div className="flex justify-end gap-3">
                    <Button
                        className="py-2 px-6 bg-white text-black"
                        onClick={close}
                    >Close</Button>
                    {selectedStock && (
                        <Button
                            onClick={handleSubmit}
                            disabled={!quantity || isInvalid || isExceedingStock}
                        >
                            Sponsor Product
                        </Button>
                    )}
                </div>
            </Card>

        </Modal>
    )
}