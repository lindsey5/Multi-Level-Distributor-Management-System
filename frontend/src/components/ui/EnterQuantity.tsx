import { useState, type SetStateAction } from "react";
import Card from "./Card";
import Modal from "./Modal";
import type { Variant } from "../../types/variant.type";
import TextField from "./Textfield";
import { cn, formatToPeso } from "../../utils/helpers";
import Button from "./Button";
import type { VariantWithQuantity } from "../../pages/Dashboard/Inventory";
import Chip from "./Chip";

interface EnterQuantityProps {
    setItems: React.Dispatch<SetStateAction<VariantWithQuantity[]>>;
    open: boolean;
    close: () => void;
    variant: Variant | null;
    label: string;
    buttonClassName?: string;
    showPrice?: boolean;
    buttonLabel: string;
}

export default function EnterQuantity({ setItems, open, close, variant, label, buttonClassName, buttonLabel, showPrice = true }: EnterQuantityProps) {
  const [quantity, setQuantity] = useState<number>(1);

    const stock = variant?.stock || 0;

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

    const handleSell = () => {
        close();
        setItems(prev => {
            let found = false;
            const updated = prev.map(item => {
                if (item._id === variant?._id) {
                    found = true;
                    // Add quantity but cap at stock
                    const newQty = Math.min(item.quantity + quantity, stock);
                    return { ...item, quantity: newQty };
                }
                return item;
            });

            if (!found && variant) {
                return [...updated, { ...variant, quantity: Math.min(quantity, stock) }];
            }

            return updated;
        });
    };

    return (
        <Modal open={open} onClose={close}>
            <Card className="space-y-5">
                <div className="flex gap-3">
                <img className="w-20 h-20" src={variant?.image_url} alt="" />
                <div>
                    <h1 className="mb-2 text-sm xl:text-md font-bold">{variant?.product?.product_name}</h1>
                    <Chip className="text-xs">{variant?.variant_name}</Chip>
                    <p className="mt-2 text-sm xl:text-md">Available Stock: {stock}</p>
                    {showPrice && <p className="text-sm xl:text-md">Price: {formatToPeso(variant?.price || 0)}</p>}
                </div>
                </div>

                <TextField
                    label={label}
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

                <div className="flex justify-end">
                <Button
                    className={cn(
                        "py-2 px-10",
                        buttonClassName,
                    )}
                    disabled={!quantity || isInvalid || isExceedingStock}
                    onClick={handleSell}
                >
                    {buttonLabel}
                </Button>
                </div>
            </Card>
        </Modal>
    );
}