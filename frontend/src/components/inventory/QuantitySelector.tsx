import { Minus, Plus } from "lucide-react";
import type { VariantWithQuantity } from "../../pages/Dashboard/Inventory";

interface QuantitySelectorProps {
    item: VariantWithQuantity;
    updateQuantity: (variantId: string, quantity: number) => void;
}

export default function QuantitySelector ({ updateQuantity, item } : QuantitySelectorProps) {
    return (
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
                onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
            />
            <button
                onClick={() => updateQuantity(item._id, 1)}
                disabled={item.quantity >= item.stock}
                className="disabled:cursor-not-allowed cursor-pointer"
            >
                <Plus size={18}/>
            </button>
        </div>
    )
}