import { useDispatch, useSelector } from "react-redux";
import { useUpdateStockTransferStatus } from "../../hooks/stock/use-update-stock-transfer-log.hook";
import type { StockTransferLog } from "../../types/stock-transfer.type";
import { formatDate, formatToPeso } from "../../utils/helpers";
import { promiseToast } from "../../utils/sileo";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Chip from "../ui/Chip";
import Modal from "../ui/Modal";
import { authService } from "../../services/authService";
import { setAuth } from "../../lib/features/auth/authSlice";
import type { RootState } from "../../lib/features/store";
import type { Socket } from "socket.io-client";
import DeliveryStatusChip from "../ui/DeliveryChip";

interface StockTransferItemsProps {
    close: () => void;
    stockTransferLog: StockTransferLog | null;
    socket: Socket | null;
}

export default function StockTransferItems ({ close, stockTransferLog, socket } : StockTransferItemsProps) {
    const updateStockTransferMutation = useUpdateStockTransferStatus();
    const { distributor, refreshToken } = useSelector((store : RootState) => store.auth);
    const dispatch = useDispatch();

    const handleUpdateStatus = async (status: string) => {
        if(!stockTransferLog) return;

        const isConfirmed = confirm(`Are you sure you want to mark this as ${status}?`);

        if (!isConfirmed) return;

        const data = await promiseToast(updateStockTransferMutation.mutateAsync({ id: stockTransferLog?._id, status }))
        
        if(socket && data.stockTransfer){
            const response = await authService.refreshAccessToken(refreshToken || "");

            dispatch(setAuth({
                accessToken: response.token.accessToken, 
                refreshToken: response.token.refreshToken,
                distributor: response.distributor
            }))

            socket.emit("send-stock-transfer-notification", {
                distributor_name: distributor?.distributor_name,
                stockTransfer: data.stockTransfer,
                status
            })
        }
    }

    const handleClose = () =>{
        if(updateStockTransferMutation.isPending) return;

        close();
    }

    return (
        <Modal open={stockTransferLog !== null} onClose={handleClose}>
            <Card className="">
                <h2 className="text-md font-semibold mb-3">Items to Receive</h2>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                {stockTransferLog?.items.map(item => (
                        <div
                            key={item.variant._id}
                            className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3 border-b border-gray-300 py-3"
                        >
                            <img
                                src={item.variant.image_url}
                                alt={item.variant.variant_name}
                                className="w-14 h-14 object-cover rounded"
                            />

                            <div className="flex-1">
                                <p className="font-medium text-sm">
                                    {item.variant.product?.product_name}
                                </p>
                                <Chip className="text-xs">{item.variant.variant_name}</Chip>
                                <p className="text-sm text-gray mt-3">
                                    {formatToPeso(item.variant.price)}
                                </p>
                            </div>
                            <p className="text-sm font-semibold">
                                Quantity: {item.quantity}
                            </p>
                        </div>
                ))}
                </div>
                <h2 className="text-md font-semibold mt-4 mb-3">Distribution Details</h2>
                <div className="border border-gray-300 p-2 rounded-lg shadow-lg">
                    <p className="text-sm">Sender: {`${stockTransferLog?.sender?.firstname} ${stockTransferLog?.sender?.lastname}`}</p>
                    <p className="text-sm">Date Requested: {formatDate(stockTransferLog?.createdAt)}</p>
                    {stockTransferLog?.status === 'received' && (
                        <p className="text-sm">Date Received: {formatDate(stockTransferLog.updatedAt)}</p>
                    )}
                    <div className="flex justify-start mt-3">
                       <DeliveryStatusChip status={stockTransferLog?.status || ""} />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        className="py-2 text-sm py-2 bg-gray-100 text-black border-gray-400 shadow-none"
                        onClick={handleClose}
                        disabled={updateStockTransferMutation.isPending}
                    >Close</Button>
                    
                    {stockTransferLog?.status === 'delivered' && (
                        <Button className="py-2" onClick={() => handleUpdateStatus('received')} disabled={updateStockTransferMutation.isPending}>
                            Mark as Received
                        </Button>
                    )}

                    {stockTransferLog?.status === 'pending' && (
                        <Button className="py-2" onClick={() => handleUpdateStatus('approved')} disabled={updateStockTransferMutation.isPending}>
                            Approve
                        </Button>
                    )}
                </div>
            </Card>
        </Modal>
    )
}