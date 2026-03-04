"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (user: {
    userId: string;
    username: string;
    role: string;
}) => {
    if (socket) return socket; // zaten varsa tekrar açma

    socket = io("http://localhost:5000", {
        withCredentials: true,
        auth: {
            userId: user.userId,
            username: user.username,
            role: user.role,
        },
    });

    return socket;
};

export const getSocket = () => {
    return socket; // ❗ artık throw yok
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};