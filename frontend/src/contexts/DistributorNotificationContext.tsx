import { type SocketContextProviderProps, type SocketContextType } from './context.type.';
import { useSocket } from '../hooks/useSocket';
import { createContext } from 'react';

export const DistributorNotificationSocketContext = createContext<SocketContextType>({
    socket: null,
});

const DistributorNotificationSocketContextProvider = ({ children } : SocketContextProviderProps) => {
    const socket = useSocket({
        namespace: "/distributor-notification"
    });

    return (
        <DistributorNotificationSocketContext.Provider value={{ socket }}>
        {children}
        </DistributorNotificationSocketContext.Provider>
    );
};

export default DistributorNotificationSocketContextProvider