import { X } from "lucide-react";
import { useGetStockOrderById } from "../../hooks/stock-order/use-get-stock-order.hook";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import DeliveryStatusChip from "../ui/DeliveryChip";
import Chip from "../ui/Chip";
import Button from "../ui/Button";
import { formatDate } from "../../utils/helpers";
import { useMemo } from "react";
import { useUpdateStockOrder } from "../../hooks/stock-order/use-update-stock-order.hook";
import { promiseToast } from "../../utils/sileo";
import { useSocket } from "../../hooks/useSocket";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../lib/features/store";
import { setAuth } from "../../lib/features/auth/authSlice";
import { authService } from "../../services/authService";

interface StockOrderDetailsProps {
    stockOrderId: string | null;
    close: () => void;
}

function StockOrderDetailsSkeleton() {
    return (
        <>
        {/* Status Skeleton */}
        <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />

        {/* Items Skeleton */}
        <div className="space-y-3 max-h-[40vh] overflow-y-auto">
            <h1 className="font-bold">Items:</h1>

            {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="flex items-center gap-3 border-b border-[var(--border-panel)] py-3"
            >
                {/* Image skeleton */}
                <div className="w-14 h-14 rounded bg-gray-200 animate-pulse" />

                {/* Text skeletons */}
                <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
                <div className="h-5 w-24 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
                </div>
            </div>
            ))}
        </div>
        </>
    );
}

export default function StockOrderDetails({ stockOrderId, close }: StockOrderDetailsProps) {
    const { data, isFetching } = useGetStockOrderById(stockOrderId || "undefined");
    const updateStockOrderMutation = useUpdateStockOrder();
    const socket = useSocket({ namespace: '/notification' });
    const { refreshToken } = useSelector((store : RootState) => store.auth);
    const dispatch = useDispatch();

    const canCancel = useMemo(() => {
        if(!data?.stockOrder) return false;

        return data.stockOrder.status === 'pending' || data.stockOrder.status === 'approved'

    }, [data])

    const handleUpdate =  async (status: string) => {
        if(!stockOrderId) return;

        const isConfirmed = confirm(`Are you sure you want to mark your stock order as ${status}?`);

        if (!isConfirmed) return;

        const data = await promiseToast(
            updateStockOrderMutation.mutateAsync({ 
                id: stockOrderId, 
                status: status
            }),
        )

        if(socket && data.stockOrder){
            const response = await authService.refreshAccessToken(refreshToken || "");
            
            dispatch(setAuth({
                accessToken: response.token.accessToken, 
                refreshToken: response.token.refreshToken,
                distributor: response.distributor
            }))

            socket.emit("send-stock-order-update", data.stockOrder)
        }
    }

    return (
        <Modal onClose={close} open={stockOrderId !== null}>
            <Card className="space-y-3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-md md:text-lg font-bold">Stock Order Details</h2>
                    <button
                        onClick={close}
                        className="cursor-pointer hover:opacity-50"
                    >
                        <X />
                    </button>
                </div>

                {/* ITEMS */}
                <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                {isFetching || !data?.stockOrder ? (
                    <StockOrderDetailsSkeleton />
                ) : (
                <>
                    <div className="flex flex-col gap-2 border-b border-gray-300 pb-3">
                    <div className="flex items-center justify-between w-full">
                        <div>
                        <h1 className="text-sm md:text-base font-bold">
                            {data.stockOrder.stock_order_id}
                        </h1>
                        <p className="text-xs md:text-sm text-gray-500">
                            Created: {formatDate(data.stockOrder.createdAt)}
                        </p>
                        </div>

                        <DeliveryStatusChip status={data.stockOrder.status} />
                    </div>
                    </div>

                    <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                    <h1 className="font-bold">Items:</h1>

                    {data?.stockOrder?.items.map((item) => (
                        <div
                        key={item.variant_id}
                        className="flex items-center gap-3 border-b border-[var(--border-panel)] py-3"
                        >
                        <img
                            src={item.variant.image_url}
                            alt={item.variant.variant_name}
                            className="w-14 h-14 object-cover rounded"
                        />

                        <div className="flex-1">
                            <p className="font-bold text-sm mb-2">
                            {item.variant.product?.product_name}
                            </p>
                            <Chip className="text-sm">{item.variant.variant_name}</Chip>
                            <p className="font-medium text-xs md:text-sm mt-3">
                            Quantity: {item.quantity}
                            </p>
                        </div>
                        </div>
                    ))}
                    </div>
                </>
                )}
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        className="px-4 py-2 bg-white text-black border-gray-400"
                        onClick={close}
                        disabled={updateStockOrderMutation.isPending}
                    >
                        Close
                    </Button>
                    {canCancel && (
                        <Button 
                            className="px-4 py-2" 
                            onClick={() => handleUpdate('cancelled')}
                            disabled={updateStockOrderMutation.isPending}
                        >
                            Cancel Order
                        </Button>
                    )}
                    {data?.stockOrder.status === 'delivered' && (
                        <Button 
                            className="px-4 py-2" 
                            onClick={() => handleUpdate('received')} 
                            disabled={updateStockOrderMutation.isPending}
                        >
                            Mark as Received
                        </Button>
                        )
                    }
                </div>
            </Card>
        </Modal>
    );
}