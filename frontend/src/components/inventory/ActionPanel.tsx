import { useState } from "react";
import type { VariantWithQuantity } from "../../pages/Dashboard/Inventory";
import { cn, formatToPeso } from "../../utils/helpers";
import Button from "../ui/Button";
import Chip from "../ui/Chip";
import { Trash, X } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

const ActionPanel = ({
    items,
    enableReturn,
    onOpen,
    updateQuantity,
    handleRemove
}: {
    items: VariantWithQuantity[];
    enableReturn: boolean;
    onOpen: () => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    handleRemove: (id: string) => void;
}) => {
    const [open, setOpen] = useState(false);

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            {/* MOBILE TOGGLE BUTTON */}
            <div className="lg:hidden fixed bottom-4 right-4 z-10">
                <Button
                    onClick={() => setOpen(true)}
                    className="rounded-full px-4 py-3 shadow-lg bg-black text-white"
                >
                    View Items ({items.length})
                </Button>
            </div>

            {/* BACKDROP */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/40 z-50"
                />
            )}

            {/* PANEL */}
            <div
                className={cn(
                    "bg-white border border-gray-300 flex flex-col min-h-0",
                    "lg:w-96 lg:static lg:rounded-xl lg:shadow-sm z-50 md:z-10",

                    // MOBILE DRAWER
                    "fixed bottom-0 left-0 right-0 rounded-t-2xl",
                    "transition-transform duration-300",

                    open ? "translate-y-0" : "translate-y-full lg:translate-y-0"
                )}
            >
                {/* HEADER */}
                <div className="p-4 border-b border-gray-300 flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-base">
                            {enableReturn ? "Return Summary" : "Sell Summary"}
                        </h2>

                        <p className="text-xs text-gray-500 mt-1">
                            {items.length === 0
                                ? "No items selected yet"
                                : `${totalItems} total unit(s) selected`}
                        </p>
                    </div>

                    {/* CLOSE BUTTON (MOBILE ONLY) */}
                    <button
                        onClick={() => setOpen(false)}
                        className="lg:hidden text-gray-500"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* EMPTY STATE */}
                {items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center p-6 text-center">
                        <div className="space-y-2">
                            <div className="text-gray-400 text-sm">
                                Your list is empty
                            </div>
                            <div className="text-xs text-gray-400">
                                Select a product from the table
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[60vh] lg:max-h-full">
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between gap-3 p-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition"
                            >
                                {/* LEFT */}
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-sm font-medium text-gray-800">
                                        {item.product?.product_name}
                                    </h3>

                                    <Chip className="w-fit text-xs">
                                        {item.variant_name}
                                    </Chip>

                                    <QuantitySelector updateQuantity={updateQuantity} item={item}/>
                                </div>

                                {/* RIGHT */}
                                <div className="flex flex-col items-end space-y-3">
                                    <p className="text-right">
                                        {formatToPeso(
                                            item.price * item.quantity
                                        )}
                                    </p>
                                    <button
                                        onClick={() => handleRemove(item._id)}
                                        className="hover:text-red-500 cursor-pointer"
                                    >
                                        <Trash size={16}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* FOOTER */}
                <div className="border-t border-gray-300 p-4 bg-white">
                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-500">Items</span>
                        <span className="font-medium">{totalItems}</span>
                    </div>

                    <Button
                        disabled={items.length === 0}
                        onClick={onOpen}
                        className={cn(
                            "w-full py-2 text-sm rounded-xl",
                            items.length === 0
                                ? "bg-gray-200 text-gray-400"
                                : enableReturn
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-black hover:bg-gray-900 text-white"
                        )}
                    >
                        {enableReturn ? "Confirm Return" : "Confirm Sale"}
                    </Button>

                    <p className="text-xs text-gray-400 text-center mt-2">
                        Review items before confirming
                    </p>
                </div>
            </div>
        </>
    );
};

export default ActionPanel;