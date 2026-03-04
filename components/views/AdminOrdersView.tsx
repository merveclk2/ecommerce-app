"use client";

import { useContext } from "react";
import { OrderContext } from "@/context/OrderContext";

export default function OrdersPage() {
  const context = useContext(OrderContext);
  if (!context) return null;

  const { orders, deleteOrder } = context;

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Siparişler</h1>

      {orders.length === 0 ? (
        <p>Henüz sipariş yok.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
            >
              <p><strong>Tarih:</strong> {order.date}</p>
              <p><strong>Toplam:</strong> {order.total} TL</p>

              <div className="mt-2">
                <strong>Müşteri:</strong>
                <p>
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p>Telefon: {order.customer.phone}</p>
              </div>

              <div className="mt-4">
                <strong>Ürünler:</strong>
                <ul className="list-disc ml-6">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.price} TL x{" "}
                      {"quantity" in item ? item.quantity : 1}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => deleteOrder(order.id)}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
              >
                Sipariş Tamamlandı
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
