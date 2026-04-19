import { Bell } from "lucide-react";
import { useGetNotifications } from "../../hooks/notification/use-get-notifications.hook";
import { useState, useEffect } from "react";
import { cn, timeAgo } from "../../utils/helpers";
import type { DistributorNotification } from "../../types/notification.type";
import { useReadAllNotifications, useReadNotification } from "../../hooks/notification/use-read-notification.hook";
import ReturnDetailsModal from "../return-request/ReturnDetailsModal";
import { useSocket } from "../../hooks/useSocket";
import StockTransferItems from "../stockTransferLog/StockTransferItems";


export default function NotificationBell() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [notification, setNotification] = useState<DistributorNotification | null>(null);
    const socket = useSocket({ namespace: "/distributor-notification" });
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
            const target = e.target as HTMLElement;
            if (!target.closest('#notification-bell')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
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

    const readAllNotifications = async () => {
        setNotifications(prev => 
            prev.map(notif => ({ ...notif, status: 'read' }))
        )

        setUnread(0);

        await readAllNotificationsMutation.mutate();
    }

    const handleClose = () => {
        setNotification(null)
    }

    return (
        <>
        <StockTransferItems 
            close={handleClose}
            stockTransferLog={notification?.stockTransfer || null}
            open={notification !== null}
            socket={userNotificationSocket}
        />
        <ReturnDetailsModal 
            returnRequest={notification?.returnRequest || null}
            close={handleClose}
        />
        <div className="relative" id="notification-bell">
            {/* Bell Button */}
            <button
                data-tour="header-notification"
                onClick={() => setShowDropdown(prev => !prev)}
                className="cursor-pointer flex items-center justify-center font-semibold relative"
            >
                <Bell className="text-md md:text-lg" fill="black" size={25}/>
            </button>
            {unread > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unread}
                </span>
            )}
            {showDropdown && (
                <div className="w-[80vw] md:w-70 border border-gray-300 shadow-md absolute pb-5 -right-10 md:right-5 top-12 rounded-md bg-white">
                    <div className="flex justify-between gap-3 px-2 py-5 border-b border-gray-300">
                        <h1 className="bg-white text-md xl:text-lg font-bold">Notifications</h1>
                        <button className="text-xs md:text-sm cursor-pointer" onClick={readAllNotifications}>Mark all as Read</button>
                    </div>
                    {notifications.length === 0 && !isFetching && <p className="text-center mt-5 text-sm xl:text-md">No notifications yet</p>}
                    <div className="max-h-[50vh] md:max-h-[30vh] overflow-y-auto">
                    {notifications.map(notification => (
                        <div 
                            key={notification._id}
                            className={cn(
                                "cursor-pointer hover:bg-gray-100 border-b border-gray-300 py-2",
                                notification.status === 'read' && 'opacity-60'
                            )}
                            onClick={() => readNotification(notification)}
                        >
                            <div className="flex gap-3 items-center px-2 relative">
                                <div className="relative">
                                    <div className="cursor-pointer flex w-10 h-10 rounded-full bg-black items-center justify-center text-white font-semibold">
                                        <Bell size={20} />
                                    </div>
                                    {/* Red dot */}
                                    {notification.status === 'unread' && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <p className={cn("text-xs break-words", notification.status === 'unread' && 'font-bold')}>
                                        {notification.message}
                                    </p>
                                    <span className="text-xs mt-1 text-gray-400">{timeAgo(notification.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                    {isFetching && <p className="w-full text-center text-xs md:text-sm my-3">Loading...</p>}
                    <div className={cn(
                        "justify-center mt-2",
                        page < (data?.pagination.totalPages || 1) && !isFetching ? 'flex' : 'hidden'
                    )}>
                        <button
                            className="disabled:cursor-not-allowed cursor-pointer bg-black text-white px-3 py-1 text-xs rounded-md"
                            onClick={() => setPage(prev => prev + 1)}
                        >See more</button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
}