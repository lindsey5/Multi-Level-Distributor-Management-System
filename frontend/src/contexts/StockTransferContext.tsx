import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import type { RootState } from '../lib/features/store';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

interface StockTransferSocketContextType {
    socket: Socket | null;
}

export const StockTransferSocketContext = createContext<StockTransferSocketContextType>({
    socket: null,
});

interface StockTransferSocketContextProviderProps {
    children: ReactNode;
}

const StockTransferSocketContextProvider: React.FC<StockTransferSocketContextProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { accessToken } = useSelector((state : RootState) => state.auth); 
    
    useEffect(() => {
        const connectSocket =() => {
            try {
                const newSocket = io(`${SOCKET_URL}/stock-transfer`, { 
                    auth: { token: `Bearer ${accessToken}`}
                 });

                newSocket.on("connect", () => {
                    console.log("Connected to Socket");
                });

                newSocket.on("stockTransfer", (data) => {
                    console.log(data)
                })

                setSocket(newSocket);
            } catch (error : any) {
                console.error("Error connecting to socket:", error.message);
            }
        };

        connectSocket();

        return () => {
            if (socket) socket.off("stockTransfer");
        };
    }, []);

    return (
        <StockTransferSocketContext.Provider value={{ socket }}>
        {children}
        </StockTransferSocketContext.Provider>
    );
};

export default StockTransferSocketContextProvider