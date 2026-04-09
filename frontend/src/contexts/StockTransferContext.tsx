import { type SocketContextProviderProps, type SocketContextType } from './context.type.';
import { useSocket } from '../hooks/useSocket';
import { createContext } from 'react';

export const StockTransferSocketContext = createContext<SocketContextType>({
    socket: null,
});

const StockTransferSocketContextProvider = ({ children } :SocketContextProviderProps) => {
    const socket = useSocket({
        namespace: "/stock-transfer"
    });

    return (
        <StockTransferSocketContext.Provider value={{ socket }}>
        {children}
        </StockTransferSocketContext.Provider>
    );
};

export default StockTransferSocketContextProvider