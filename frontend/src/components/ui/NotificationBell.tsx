import { Bell } from "lucide-react";
import { useGetNotifications } from "../../hooks/notification/use-get-notifications.hook";
import { useState, useEffect, useContext } from "react";
import { cn, minutesAgo } from "../../utils/helpers";
import type { DistributorNotification } from "../../types/notification.type";
import { StockTransferSocketContext } from "../../contexts/StockTransferContext";
import { useReadNotification } from "../../hooks/notification/use-read-notification.hook";

export default function NotificationBell() {
    const [showDropdown, setShowDropdown] = useState(false);
    const { socket } = useContext(StockTransferSocketContext);

    const limit = 50;
    const [page, setPage] = useState(1);
    const [notifications, setNotifications] = useState<DistributorNotification[]>([]);
    const [unread, setUnread] = useState(0);

    const readNotificationMutation = useReadNotification();

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
        return () => {
            socket?.off('stockTransfer');
            document.removeEventListener('click', handleClickOutside);
        }

    }, [data])

    useEffect(() => {
        if(socket) {
            socket.on("stockTransfer", (data) => {
                setNotifications(prev => [data, ...prev]);
                setUnread(prev => prev + 1);
            })
        }
        return () => {
            if(socket) socket.off('stockTransfer');
        }
    }, [socket])

    const readNotification = (id: string) => {
        readNotificationMutation.mutate({ id })
        setUnread(prev => prev -1)
    }

    return (
        <div className="relative" id="notification-bell">
            {/* Bell Button */}
            <button
                onClick={() => setShowDropdown(prev => !prev)}
                className="cursor-pointer flex w-10 h-10 rounded-full bg-black items-center justify-center text-white font-semibold relative"
            >
                <Bell size={20} />
            </button>
            {unread > 0 && (
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unread}
                </span>
            )}
            {showDropdown && (
                <div className="w-[80vw] md:w-70 border border-gray-300 shadow-md absolute pb-5 -right-10 md:right-5 top-12 rounded-md bg-white">
                    <h1 className="sticky top-1 bg-white text-md xl:text-lg font-bold border-b border-gray-300 px-2 py-5">Notifications</h1>
                    {notifications.length === 0 && <p className="text-center mt-5 text-sm xl:text-md">No notifications yet</p>}
                    <div className="max-h-[40vh] md:max-h-[30vh] overflow-y-auto">
                    {notifications.map(notification => (
                        <div 
                            key={notification._id}
                            className={cn(
                                "cursor-pointer hover:bg-gray-100 border-b border-gray-300 py-2",
                                notification.status === 'read' && 'opacity-60'
                            )}
                            onClick={() => readNotification(notification._id)}
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
                                    <span className="text-xs mt-1 text-gray-400">{minutesAgo(notification.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                    {!(page >= (data?.pagination.totalPages || 1)) && <div className="flex justify-center mt-2">
                        <button
                            disabled={isFetching}
                            className="disabled:cursor-not-allowed cursor-pointer bg-black text-white px-3 py-1 text-xs rounded-md"
                            onClick={() => setPage(prev => prev + 1)}
                        >{isFetching ? 'Loading...' : 'See more'}</button>
                    </div>}
                </div>
            )}
        </div>
    );
}