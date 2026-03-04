"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/app/socket";
import { useAuth } from "@/context/AuthContext";

interface Message {
    sender: "admin" | "user";
    message: string;
    time: string;
}

export default function UserSupportPage() {
    const { user, loading } = useAuth();

    const [chatActive, setChatActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [waiting, setWaiting] = useState(true);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (loading || !user) return;

        const socket = getSocket();
        if (!socket) return;

        socket.emit("join_support");

        const handleChatStarted = () => {
            setWaiting(false);
            setChatActive(true);
            setMessages([]);
        };

        const handleReceiveMessage = (data: Message) => {
            setMessages((prev) => [...prev, data]);
        };

        const handleChatClosed = () => {
            setChatActive(false);
            setWaiting(true);
            setMessages([]);
        };

        socket.on("chat_started", handleChatStarted);
        socket.on("receive_message", handleReceiveMessage);
        socket.on("chat_closed", handleChatClosed);

        return () => {
            socket.off("chat_started", handleChatStarted);
            socket.off("receive_message", handleReceiveMessage);
            socket.off("chat_closed", handleChatClosed);
        };
    }, [user, loading]);

    const handleCloseChat = () => {
        const socket = getSocket();
        if (!socket) return;
        socket.emit("close_chat");
    };

    const handleSendMessage = () => {
        if (!input.trim()) return;

        const socket = getSocket();
        if (!socket) return;

        const newMessage: Message = {
            sender: "user",
            message: input,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        socket.emit("send_message", newMessage);

        setInput("");
    };

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white">

            {/* WAITING SCREEN */}

            {waiting && !chatActive && (
                <div className="flex items-center justify-center h-full">

                    <div className="bg-slate-900 p-10 rounded-2xl shadow-chat text-center">

                        <h2 className="text-2xl font-semibold mb-2">
                            Canlı Destek
                        </h2>

                        <p className="text-slate-400">
                            Destek sırasındasınız...
                        </p>

                    </div>

                </div>
            )}

            {/* CHAT */}

            {chatActive && (
                <>
                    {/* HEADER */}

                    <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">

                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                                S
                            </div>

                            <div>
                                <p className="font-semibold">Canlı Destek</p>

                                <div className="flex items-center gap-2 text-xs">

                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>

                                    <span className="text-green-400">Online</span>

                                </div>
                            </div>

                        </div>

                        <button
                            onClick={handleCloseChat}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm"
                        >
                            Bitir
                        </button>

                    </div>

                    {/* MESSAGES */}

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">

                        {messages.map((msg, index) => {

                            const isMine = msg.sender === "user";

                            return (

                                <div
                                    key={index}
                                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                >

                                    <div
                                        className={`max-w-md px-4 py-3 rounded-chat shadow-chat text-sm
                                        ${isMine
                                                ? "bg-indigo-600 text-white"
                                                : "bg-slate-800 text-slate-200"
                                            }`}
                                    >

                                        {msg.message}

                                        <div className="text-xs opacity-60 mt-1 text-right">
                                            {msg.time}
                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                        <div ref={bottomRef}></div>

                    </div>

                    {/* INPUT */}

                    <div className="p-4 bg-slate-900 border-t border-slate-800">

                        <div className="flex gap-3">

                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSendMessage();
                                }}
                                placeholder="Mesaj yaz..."
                                className="flex-1 bg-slate-800 border border-slate-700 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />

                            <button
                                onClick={handleSendMessage}
                                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-full"
                            >
                                Gönder
                            </button>

                        </div>

                    </div>
                </>
            )}
        </div>
    );
}