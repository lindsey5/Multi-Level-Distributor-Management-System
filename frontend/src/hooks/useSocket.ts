import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import type { RootState } from "../lib/features/store";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

interface UseSocketOptions {
    namespace: string;
    events?: { [event: string]: (args: any) => void };
}

export const useSocket = ({ namespace, events = {} }: UseSocketOptions) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { accessToken } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!accessToken) return;

        const connectSocket = () => {
            try{
                const newSocket = io(`${SOCKET_URL}${namespace}`, {
                    auth: { token: `Bearer ${accessToken}` },
                });

                newSocket.on("connect", () => console.log("Connected to socket"))

                // Register event listeners
                Object.entries(events).forEach(([event, callback]) => {
                    newSocket.on(event, callback);
                });

                setSocket(newSocket);
            }catch(error : any) {
                console.error("Error connecting to socket:", error.message);
            }
        }
        connectSocket();

        return () => {
            if(socket) {
                socket.disconnect();
            }
        };
    }, [accessToken]);

    return socket;
};