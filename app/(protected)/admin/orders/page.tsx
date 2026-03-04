"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { useAuth } from "@/context/AuthContext";
import { getSocket } from "@/app/socket";

interface Order {
    _id: string;
    productName: string;
    price: number;
    quantity: number;
    status: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const { language } = useLanguage();
    const { user, loading } = useAuth();
    const t = translations[language];

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders");
            if (Array.isArray(res.data)) {
                setOrders(res.data);
            }
        } catch (err: any) {
            console.log("orders fetch error:", err.response?.status || err);
        }
    };

    useEffect(() => {
        if (loading || !user) return;

        fetchOrders();

        const socket = getSocket();
        if (!socket) return; // 🔥 kritik null kontrol

        socket.on("newOrder", fetchOrders);

        return () => {
            socket.off("newOrder", fetchOrders);
        };
    }, [user, loading]);

    const completeOrder = async (id: string) => {
        const toastId = toast.loading(t.completingOrder);

        try {
            await api.put(`/orders/${id}/complete`);
            fetchOrders();
            toast.success(t.orderCompleted, { id: toastId });
        } catch {
            toast.error(t.orderCompleteFailed, { id: toastId });
        }
    };

    const deleteOrder = async (id: string) => {
        const toastId = toast.loading(t.deletingOrder);

        try {
            await api.delete(`/orders/${id}`);
            fetchOrders();
            toast.success(t.orderDeleted, { id: toastId });
        } catch {
            toast.error(t.orderDeleteFailed, { id: toastId });
        }
    };

    return (
        <div className="min-h-screen p-10 space-y-6 bg-background transition-colors">

            <h1 className="text-3xl font-bold text-foreground">
                {t.ordersTitle}
            </h1>

            {orders.length === 0 && (
                <p className="text-muted">
                    {t.noOrders}
                </p>
            )}

            {orders.map((order) => (
                <div
                    key={order._id}
                    className="bg-card text-card-foreground border border-border rounded-xl shadow-md p-6 space-y-3"
                >
                    <p>
                        <b>{t.product}:</b> {order.productName}
                    </p>

                    <p>
                        <b>{t.price}:</b> ₺{order.price}
                    </p>

                    <p>
                        <b>{t.quantity}:</b> {order.quantity}
                    </p>

                    <p>
                        <b>{t.status}:</b>{" "}
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "completed"
                                    ? "bg-green-500/10 text-green-600"
                                    : "bg-yellow-500/10 text-yellow-600"
                                }`}
                        >
                            {order.status}
                        </span>
                    </p>

                    <div className="pt-3">
                        {order.status === "pending" && (
                            <button
                                onClick={() => completeOrder(order._id)}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                            >
                                {t.completeOrder}
                            </button>
                        )}

                        {order.status === "completed" && (
                            <button
                                onClick={() => deleteOrder(order._id)}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                {t.delete}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}