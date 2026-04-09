import { type SocketContextProviderProps, type SocketContextType } from './context.type.';
import { useSocket } from '../hooks/useSocket';
import { createContext } from 'react';

export const UserNotificationSocketContext = createContext<SocketContextType>({
    socket: null,
});

const UserNotificationSocketContextProvider  = ({ children } : SocketContextProviderProps) => {
    const socket = useSocket({
        namespace: "/notification",
        events: {}
    })

    return (
        <UserNotificationSocketContext.Provider value={{ socket }}>
        {children}
        </UserNotificationSocketContext.Provider>
    );
};

export default UserNotificationSocketContextProvider