import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../lib/features/store";
import { authService } from "../services/authService";
import { setAuth } from "../lib/features/auth/authSlice";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

interface UseSocketOptions {
    namespace: string;
    events?: { [event: string]: (args: any) => void };
}

export const useSocket = ({ namespace, events = {} }: UseSocketOptions) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!accessToken) return;

        const connectSocket = () => {
            try{
                const newSocket = io(`${SOCKET_URL}${namespace}`, {
                    auth: { token: `Bearer ${accessToken}` },
                });

                newSocket.on("connect", () => console.log("Connected to socket"))

                newSocket.on("connect_error", async () => {
                    const data = await authService.refreshAccessToken(refreshToken || "");
                    dispatch(setAuth({
                        accessToken: data.token.accessToken, 
                        refreshToken: data.token.refreshToken,
                        distributor: data.distributor
                    }))
                })

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
    }, []);

    return socket;
};