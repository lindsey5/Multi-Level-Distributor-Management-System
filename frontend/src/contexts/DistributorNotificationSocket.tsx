import { useSocket } from '../hooks/useSocket';
import { createContext } from 'react';
import type { SocketContextProviderProps, SocketContextType } from './context.type';

export const DistributorNotificationSocketContext = createContext<SocketContextType>({
    socket: null,
});

const DistributorNotificationSocketContextProvider  = ({ children } : SocketContextProviderProps) => {
    const socket = useSocket({
        namespace: "/distributor-notification",
        events: {}
    })

    return (
        <DistributorNotificationSocketContext.Provider 
            value={{ socket }}
        >
        {children}
        </DistributorNotificationSocketContext.Provider>
    );
};

export default DistributorNotificationSocketContextProvider