import { type ReactNode } from 'react';
import { Socket } from 'socket.io-client';

export interface SocketContextType {
    socket: Socket | null;
}

export interface SocketContextProviderProps {
    children: ReactNode;
}