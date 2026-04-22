import { X } from "lucide-react";
import Button from "../ui/Button";
import Chip from "../ui/Chip";
import type { ReturnRequest } from "../../types/returnRequest.type";
import Modal from "../ui/Modal";
import Card from "../ui/Card";
import ReturnRequestStatusChip from "./ReturnRequestStatusChip";
import { formatDate } from "../../utils/helpers";
import { useSocket } from "../../hooks/useSocket";
import { useCancelReturnRequest } from "../../hooks/returnRequest/use-cancel-return-request.hook";
import { promiseToast } from "../../utils/sileo";
import { authService } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../lib/features/store";
import { setAuth } from "../../lib/features/auth/authSlice";
import { useMemo } from "react";

export default function ReturnDetailsModal ({ returnRequest, close } : { returnRequest: ReturnRequest | null, close: () => void }) {
    const socket = useSocket({ namespace: "/notification" })
    const cancelReturnRequestMutation = useCancelReturnRequest();
    const { refreshToken } = useSelector((store : RootState) => store.auth);
    const dispatch = useDispatch();

    const handleCancel = async () => {
        if(!returnRequest) return;

        const isConfirmed = confirm(`Are you sure you want to cancel your return request?`);

        if (!isConfirmed) return;

        const data = await promiseToast(cancelReturnRequestMutation.mutateAsync({ id: returnRequest._id }))
    
        if(socket && data.returnRequest){
            const response = await authService.refreshAccessToken(refreshToken || "");
            
            dispatch(setAuth({
                accessToken: response.token.accessToken, 
                refreshToken: response.token.refreshToken,
                distributor: response.distributor
            }))

            socket.emit("send-cancel-return-notification", returnRequest)
        }
    }

    const canCancel = useMemo(() => {
        return returnRequest?.items.every(item => item.status === 'pending')
    }, [returnRequest])

    return (
        <Modal
            open={returnRequest !== null}
            onClose={close}
        >
            <Card className="space-y-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-md md:text-lg font-bold">Return Request Details</h2>
                    <button
                        onClick={close}
                        className="cursor-pointer hover:opacity-50"
                    >
                        <X />
                    </button>
                </div>
                <div className="border-y border-[var(--border-panel)] py-4">
                    <h1 className="font-bold">Request by:</h1>
                    <p className="text-xs md:text-sm">{returnRequest?.distributor.distributor_name}</p>
                    <p className="text-xs md:text-sm text-gray">{returnRequest?.distributor.email}</p>
                    <p className="text-xs md:text-sm font-bold">ID: {returnRequest?.distributor.distributor_id}</p>
                </div>
                <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                    <h1 className="font-bold">Items to Return:</h1>
                    {returnRequest?.items.map(item => (
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
                                <p className="font-medium text-xs md:text-sm mt-3">Quantity to return: {item.quantity}</p>
                                <div className="flex mt-3 gap-3">
                                    <ReturnRequestStatusChip status={item.status} />
                                </div> 
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs md:text-sm">Date Requested: {formatDate(returnRequest?.createdAt)}</p>
                <div className="space-y-2">
                    <h1 className="font-bold text-sm">Reason:</h1>
                    <p className="text-break-all px-2 py-3 bg-black/10 max-h-20 overflow-y-auto">{returnRequest?.reason}</p>
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        className="px-4 py-2 bg-white text-black border-gray-400"
                        onClick={close}  
                    >Close</Button>
                    {canCancel && (
                        <Button
                            className="px-4 py-2"
                            onClick={handleCancel}  
                        >Cancel Request</Button>
                    )}
                </div>
            </Card>
        </Modal>
    )
}