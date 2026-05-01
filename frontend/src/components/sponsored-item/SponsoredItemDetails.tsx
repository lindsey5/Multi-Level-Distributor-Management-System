import { X } from "lucide-react";
import Card from "../ui/Card";
import Modal from "../ui/Modal";
import Chip from "../ui/Chip";
import { promiseToast } from "../../utils/sileo";
import { useEffect, useState } from "react";
import type { SponsoredItem } from "../../types/sponsored-item.type";
import Button from "../ui/Button";
import { useGetSponsoredItemById } from "../../hooks/sponsored-item/use-get-sponsored-item.hook";
import DeliveryStatusChip from "../ui/DeliveryChip";
import { formatDate } from "../../utils/helpers";
import { useSocket } from "../../hooks/useSocket";
import { useUpdateSponsoredItemStatus } from "../../hooks/sponsored-item/use-update-sponsored-item-status.hook";
import { authService } from "../../services/authService";
import { setAuth } from "../../lib/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../lib/features/store";

interface SponsoredItemProps {
  sponsoredId: string | null;
  close: () => void;
}

export default function SponsoredItemDetails({ close, sponsoredId,}: SponsoredItemProps) {
    const socket = useSocket({ namespace: '/notification' });

    const { refreshToken } = useSelector((store : RootState) => store.auth);
    const dispatch = useDispatch();

    const updateSponsoredItemMutation = useUpdateSponsoredItemStatus();

    const { data, isFetching } = useGetSponsoredItemById(sponsoredId || "");
    const [sponsoredItem, setSponsoredItem] = useState<SponsoredItem>();

    const handleUpdate = async (status: string) => {
        if (!sponsoredId) return;

        const isConfirmed = confirm(`Are you sure you want to update the status to ${status}?`);

        if (!isConfirmed) return;
        
        const data = await promiseToast(updateSponsoredItemMutation.mutateAsync({
            id: sponsoredId || "",
            status
        }));

        if(data.sponsoredItem && socket){
             const response = await authService.refreshAccessToken(refreshToken || "");
            
            dispatch(setAuth({
                accessToken: response.token.accessToken, 
                refreshToken: response.token.refreshToken,
                distributor: response.distributor
            }))

            socket.emit("send-sponsored-item-update", data.sponsoredItem)
        }

    };

    useEffect(() => {
        if (data?.sponsoredItem) setSponsoredItem(data.sponsoredItem);
    }, [data]);

    return (
        <Modal onClose={close} open={sponsoredId !== null}>
        <Card>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-300 pb-3 mb-4">
            <div>
                <h2 className="text-lg font-semibold tracking-wide">
                Sponsored Product Request
                </h2>
                <p className="text-xs text-gray mt-1">
                View complete details of the sponsored product request.
                </p>
            </div>

            <button
                onClick={close}
                className="p-2 rounded-full transition cursor-pointer"
            >
                <X size={18} />
            </button>
            </div>

            {/* Skeleton Loading */}
            {isFetching ? (
            <div className="space-y-5">
                {/* Status + Date */}
                <div className="flex flex-col gap-3 mb-5">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-14 rounded bg-gray-300 animate-pulse" />
                        <div className="h-6 w-24 rounded bg-gray-300 animate-pulse" />
                    </div>

                    <div className="h-4 w-52 rounded bg-gray-300 animate-pulse" />
                </div>

                {/* Distributor Info Skeleton */}
                <div className="border border-gray-300 rounded-lg p-4 mb-5 space-y-4">
                    <div className="h-4 w-44 rounded bg-gray-300 animate-pulse" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <div className="h-3 w-24 rounded bg-gray-300 animate-pulse" />
                            <div className="h-4 w-full rounded bg-gray-300 animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-3 w-24 rounded bg-gray-300 animate-pulse" />
                            <div className="h-4 w-full rounded bg-gray-300 animate-pulse" />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <div className="h-3 w-14 rounded bg-gray-300 animate-pulse" />
                            <div className="h-4 w-full rounded bg-gray-300 animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                    <div className="h-4 w-40 rounded bg-gray-300 animate-pulse" />

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-gray-300 animate-pulse" />

                        <div className="flex-1 space-y-3">
                            <div className="h-4 w-3/4 rounded bg-gray-300 animate-pulse" />
                            <div className="h-6 w-24 rounded bg-gray-300 animate-pulse" />
                            <div className="h-4 w-32 rounded bg-gray-300 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
            ) : (
            <>
                {/* Status + Date */}
                <div className="flex flex-col gap-3 mb-5">
                    <div className="flex items-center gap-2">
                        <p className="text-xs md:text-sm text-gray-400">Status:</p>
                        <DeliveryStatusChip status={sponsoredItem?.status || ""} />
                    </div>

                    <p className="text-xs md:text-sm text-gray-400">Requested on:{formatDate(sponsoredItem?.createdAt)}</p>
                    {sponsoredItem?.status === 'completed' && (
                        <p className="text-xs md:text-sm text-gray-400">Completed At:{formatDate(sponsoredItem?.updatedAt)}</p>
                    )}
                </div>

                {/* Distributor Info */}
                <div className="border border-gray-300 rounded-lg p-4 mb-5">
                    <p className="text-xs uppercase tracking-widest mb-3">
                        Distributor Information
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-xs text-gray-400">Distributor Name</p>
                            <p className="font-medium">
                                {sponsoredItem?.distributor.distributor_name}
                            </p>
                            </div>

                        <div>
                            <p className="text-xs text-gray-400">Distributor ID</p>
                            <p className="font-medium">
                            {sponsoredItem?.distributor.distributor_id}
                        </p>
                        </div>

                        <div className="md:col-span-2">
                            <p className="text-xs text-gray-400">Email</p>
                            <p className="font-medium">{sponsoredItem?.distributor.email}</p>
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="border border-gray-300 rounded-lg p-4">
                    <p className="text-xs uppercase tracking-widest text-gray mb-3">
                        Sponsored Product
                    </p>

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-full md:w-auto flex justify-center md:block">
                            <img
                                src={sponsoredItem?.variant.image_url}
                                alt={sponsoredItem?.variant.variant_name}
                                className="w-20 h-20 object-cover rounded-lg border border-[var(--border-panel)]"
                            />
                        </div>

                        <div className="flex-1 space-y-2">
                            <p className="font-semibold text-sm md:text-base">
                                {sponsoredItem?.variant.product?.product_name}
                            </p>

                            <div className="flex items-center gap-2">
                                <Chip className="text-xs">{sponsoredItem?.variant.variant_name}</Chip>
                            </div>

                            <p className="text-sm text-gray-400">
                                Quantity:{sponsoredItem?.quantity}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 items-center justify-end mt-5">
                    <Button
                        className="px-4 py-2 bg-white text-black border-gray-400"
                        onClick={close}
                        disabled={updateSponsoredItemMutation.isPending}
                    >
                        Close
                    </Button>
                    {['pending', 'approved'].includes(data?.sponsoredItem?.status || "")  && (
                        <Button 
                            className="px-4 py-2 bg-red-500 border-none" 
                            onClick={() => handleUpdate('cancelled')}
                            disabled={updateSponsoredItemMutation.isPending}
                        >
                            Cancel
                        </Button>
                    )}
                                     
                    {data?.sponsoredItem?.status === 'approved' && (
                        <Button 
                            className="px-4 py-2" 
                            onClick={() => handleUpdate('completed')}
                            disabled={updateSponsoredItemMutation.isPending}
                        >
                            Mark as Completed
                        </Button>
                        )
                    }
                </div>
            </>
            )}
        </Card>
        </Modal>
    );
}