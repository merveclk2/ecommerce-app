"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "@/lib/axios";

interface Order {
  _id: string;
  productName: string;
  price: number;
  quantity: number;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  // 🔥 Siparişleri çek
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
    fetchOrders();

    const socket = io("http://localhost:5000", {
      withCredentials: true,  // 🔥 BU ŞART
    });

    socket.on("connect", () => {
      console.log("ADMIN SOCKET CONNECTED:", socket.id);
    });

    // 🔥 Yeni sipariş geldiğinde otomatik yenile
    socket.on("newOrder", () => {
      console.log("NEW ORDER EVENT RECEIVED");
      fetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 🔥 Siparişi tamamla
  const completeOrder = async (id: string) => {
    try {
      await api.put(`/orders/${id}/complete`);
      fetchOrders();
    } catch (err: any) {
      console.log("Complete error:", err.response?.status || err);
    }
  };

  // 🔥 Siparişi sil
  const deleteOrder = async (id: string) => {
    try {
      await api.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err: any) {
      console.log("Delete error:", err.response?.status || err);
    }
  };

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">
        Siparişler (Gerçek Zamanlı)
      </h1>

      {orders.length === 0 && (
        <p className="text-gray-500">Henüz sipariş yok.</p>
      )}

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white p-6 rounded shadow space-y-2"
        >
          <p><b>Ürün:</b> {order.productName}</p>
          <p><b>Fiyat:</b> ₺{order.price}</p>
          <p><b>Adet:</b> {order.quantity}</p>

          <p>
            <b>Durum:</b>{" "}
            <span
              className={`px-2 py-1 rounded text-sm ${order.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {order.status}
            </span>
          </p>

          {order.status === "pending" && (
            <button
              onClick={() => completeOrder(order._id)}
              className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700 transition"
            >
              Sipariş Tamamlandı
            </button>
          )}

          {order.status === "completed" && (
            <button
              onClick={() => deleteOrder(order._id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Sil
            </button>
          )}
        </div>
      ))}
    </div>
  );
}