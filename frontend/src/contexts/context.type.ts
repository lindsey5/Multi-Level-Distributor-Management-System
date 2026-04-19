import { type ReactNode } from "react";
import type { Socket } from "socket.io-client";

export interface SocketContextProviderProps {
    children: ReactNode;
}

export interface SocketContextType {
    socket: Socket | null;
}