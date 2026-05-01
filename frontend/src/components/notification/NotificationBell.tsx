import { Bell } from "lucide-react";
import { useGetNotifications } from "../../hooks/notification/use-get-notifications.hook";
import { useState, useEffect, useContext, useRef } from "react";
import { cn, timeAgo } from "../../utils/helpers";
import type { DistributorNotification } from "../../types/notification.type";
import { useReadAllNotifications, useReadNotification } from "../../hooks/notification/use-read-notification.hook";
import ReturnDetailsModal from "../return-request/ReturnDetailsModal";
import { useSocket } from "../../hooks/useSocket";
import StockTransferItems from "../stockTransferLog/StockTransferItems";
import { DistributorNotificationSocketContext } from "../../contexts/DistributorNotificationSocket";
import SaleItems from "./SaleItems";
import { useNavigate } from "react-router-dom";
import WithdrawalRequestDetails from "../withdrawalRequest/WithdrawalRequestDetails";

export default function NotificationBell() {
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notification, setNotification] = useState<DistributorNotification | null>(null);
    const { socket } = useContext(DistributorNotificationSocketContext);
    const userNotificationSocket = useSocket({ namespace: "/notification" })
    const limit = 10;
    const [page, setPage] = useState(1);
    const [notifications, setNotifications] = useState<DistributorNotification[]>([]);
    const [unread, setUnread] = useState(0);

    const readNotificationMutation = useReadNotification();
    const readAllNotificationsMutation = useReadAllNotifications();
    const { data, isFetching } = useGetNotifications({
        page,
        limit,
    });

    useEffect(() => {
        if(data?.notifications) {
            setUnread(data.unread);
            setNotifications(prev =>
                page === 1 ? data.notifications : [...prev, ...data.notifications]
            );
        }

        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [data])

    useEffect(() => {
        if(socket) {
            socket.on("receive-notification", (data) => {
                setNotifications(prev => [data, ...prev]);
                setUnread(prev => prev + 1);
            })
        }
        return () => {
            if(socket) socket.off('receive-notification');
        }
    }, [socket])

    const readNotification = (notification : DistributorNotification) => {
        if(notification.stockOrder) {
            navigate(`/distributor/orders?id=${notification.stockOrder.stock_order_id}`);
            return;
        }else if(notification.sponsoredItem) {
            navigate(`/distributor/sponsored-items?id=${notification.sponsoredItem.sponsored_id}`);
            return;
        }

        setNotification(notification);

        if(notification.status === 'unread'){
            readNotificationMutation.mutate({ id: notification._id })
            setNotifications(prev => 
                prev.map(notif => 
                    notif._id === notification._id ? ({...notif, status: 'read'}) : notif
                )
            )
            setUnread(prev => prev -1)
        }
    }

    const readAllNotifications = () => {
        setNotifications(prev => 
            prev.map(notif => ({ ...notif, status: 'read' }))
        )

        setUnread(0);

        readAllNotificationsMutation.mutate();
    }

    const handleClose = () => {
        setNotification(null)
    }

    return (
        <>
            <WithdrawalRequestDetails 
                close={handleClose}
                withdrawalRequest={notification?.withdrawalRequest || null}
            />

            <StockTransferItems
                close={handleClose}
                stockTransferLog={notification?.stockTransfer || null}
                socket={userNotificationSocket}
            />

            <ReturnDetailsModal
                returnRequest={notification?.returnRequest || null}
                close={handleClose}
            />

            <SaleItems
                close={handleClose}
                sales={notification?.sales || null}
                open={(notification?.sales?.length || 0) > 0}
            />

            <div className="relative" ref={dropdownRef}>
                {/* Bell Button */}
                <button
                    data-tour="header-notification"
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="relative p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                >
                    <Bell className="text-black" size={22} />
                </button>

                {/* Badge */}
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
                        {unread}
                    </span>
                )}

                {/* Dropdown */}
                {showDropdown && (
                    <div className="w-[340px] bg-white border border-gray-200 shadow-xl absolute -right-10 md:right-0 top-12 rounded-xl overflow-hidden z-20">

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <h1 className="text-sm font-semibold text-black">
                                Notifications
                            </h1>

                            <button
                                onClick={readAllNotifications}
                                className="cursor-pointer text-xs text-gray-600 hover:text-black transition"
                            >
                                Mark all as read
                            </button>
                        </div>

                        {/* Empty state */}
                        {notifications.length === 0 && !isFetching && (
                            <div className="p-6 text-center text-sm text-gray-500">
                                No notifications yet
                            </div>
                        )}

                        {/* List */}
                        <div className="max-h-[320px] overflow-y-auto">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => readNotification(notification)}
                                    className={cn(
                                        "flex gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-200 transition",
                                        notification.status === "read" && "opacity-60"
                                    )}
                                >
                                    {/* Icon */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
                                            <Bell size={16} />
                                        </div>

                                        {notification.status === "unread" && (
                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-1">
                                        <p
                                            className={cn(
                                                "text-xs text-gray-800 leading-snug",
                                                notification.status === "unread" &&
                                                    "font-semibold text-black"
                                            )}
                                        >
                                            {notification.message}
                                        </p>

                                        <span className="text-[11px] text-gray-400 mt-1">
                                            {timeAgo(notification.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-gray-200 bg-white">
                            {isFetching && (
                                <p className="text-center text-xs text-gray-500 mb-2">
                                    Loading...
                                </p>
                            )}

                            {page < (data?.pagination.totalPages || 1) && !isFetching &&
                                <button
                                        onClick={() => setPage((prev) => prev + 1)}
                                        className="cursor-pointer w-full py-2 text-xs font-medium bg-black text-white rounded-md hover:bg-gray-800 transition"
                                    >
                                    See more
                                </button>
                            }
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}