"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket } from "@/app/socket";
import { useAuth } from "@/context/AuthContext";

interface WaitingUser {
    userId: string;
    username: string;
    socketId: string;
}

interface Message {
    sender: "admin" | "user";
    message: string;
    time: string;
}

export default function AdminSupportPage() {
    const { user, loading } = useAuth();

    const [waitingList, setWaitingList] = useState<WaitingUser[]>([]);
    const [activeUserId, setActiveUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isOnline, setIsOnline] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (loading || !user) return;

        const socket = getSocket();
        if (!socket) return;

        socket.emit("admin_join");

        const handleWaitingList = (list: WaitingUser[]) => {
            setWaitingList(list);
        };

        const handleReceiveMessage = (data: Message) => {
            setMessages((prev) => [...prev, data]);
        };

        const handleChatStarted = (userId: string) => {
            setActiveUserId(userId);
            setMessages([]);
            setIsOnline(true);
        };

        const handleChatClosed = () => {
            setActiveUserId(null);
            setMessages([]);
            setIsOnline(false);
        };

        socket.on("update_waiting_list", handleWaitingList);
        socket.on("receive_message", handleReceiveMessage);
        socket.on("chat_started", handleChatStarted);
        socket.on("chat_closed", handleChatClosed);

        return () => {
            socket.off("update_waiting_list", handleWaitingList);
            socket.off("receive_message", handleReceiveMessage);
            socket.off("chat_started", handleChatStarted);
            socket.off("chat_closed", handleChatClosed);
        };
    }, [user, loading]);

    const handlePickUser = (userId: string) => {
        const socket = getSocket();
        if (!socket) return;
        socket.emit("admin_pick_user", userId);
    };

    const handleSendMessage = () => {
        if (!input.trim()) return;

        const socket = getSocket();
        if (!socket) return;

        const newMessage: Message = {
            sender: "admin",
            message: input,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        socket.emit("send_message", newMessage);

        // ❌ BU SATIR KALDIRILDI
        // setMessages((prev) => [...prev, newMessage]);

        setInput("");
    };

    const handleCloseChat = () => {
        const socket = getSocket();
        if (!socket) return;
        socket.emit("close_chat");
    };

    return (
        <div className="flex h-screen bg-slate-950 text-white">

            {/* SIDEBAR */}

            <div className="w-72 bg-slate-900 border-r border-slate-800 p-5">

                <h2 className="text-lg font-semibold mb-6 text-slate-200">
                    Bekleyen Kullanıcılar
                </h2>

                {waitingList.length === 0 && (
                    <p className="text-sm text-slate-400">
                        Bekleyen kullanıcı yok
                    </p>
                )}

                <div className="space-y-2">

                    {waitingList.map((u) => (
                        <button
                            key={u.userId}
                            onClick={() => handlePickUser(u.userId)}
                            className="w-full text-left p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                        >
                            {u.username}
                        </button>
                    ))}

                </div>
            </div>

            {/* CHAT AREA */}

            <div className="flex-1 flex flex-col">

                {!activeUserId ? (

                    <div className="flex items-center justify-center h-full text-slate-400">
                        Kullanıcı seçin
                    </div>

                ) : (

                    <>
                        {/* HEADER */}

                        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                                    S
                                </div>

                                <div>
                                    <p className="font-semibold">Canlı Destek</p>
                                    <p className="text-xs text-green-400">Online</p>
                                </div>

                            </div>

                            <button
                                onClick={handleCloseChat}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm"
                            >
                                Konuşmayı Bitir
                            </button>

                        </div>

                        {/* MESSAGES */}

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950">

                            {messages.map((msg, index) => {

                                const isMine = msg.sender === "admin";

                                return (

                                    <div
                                        key={index}
                                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                    >

                                        <div
                                            className={`max-w-md px-4 py-3 rounded-xl text-sm shadow
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
        </div>
    );
}