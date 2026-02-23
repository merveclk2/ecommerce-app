"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
interface Order {
    _id: string;
    productName: string;
    price: number;
    status: string;
}

export default function MyOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/my-orders");

            if (Array.isArray(res.data)) {
                setOrders(res.data);
            }

        } catch (err: any) {
            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                router.replace("/login");
                return;
            }

            console.error("My orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-10 text-gray-900">
                    Siparişlerim
                </h1>

                {orders.length === 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow text-center">
                        <p className="text-gray-600 text-lg">
                            Henüz siparişiniz bulunmuyor.
                        </p>
                    </div>
                )}

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200"
                        >
                            <p className="text-lg font-semibold text-gray-800">
                                {order.productName}
                            </p>

                            <p className="text-gray-700 mt-2">
                                Fiyat:{" "}
                                <span className="font-bold">₺{order.price}</span>
                            </p>

                            <div className="mt-4">
                                <span
                                    className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${order.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {order.status === "completed"
                                        ? "Tamamlandı"
                                        : "Beklemede"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
