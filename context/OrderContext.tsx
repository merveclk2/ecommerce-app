"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { Product } from "./ProductContext";
import { v4 as uuidv4 } from "uuid";

/* ------------------ TYPES ------------------ */

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface OrderItem extends Product {
  quantity?: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  customer: CustomerInfo;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (items: OrderItem[], customer: CustomerInfo) => void;
  deleteOrder: (id: string) => void;
}

/* ------------------ CONTEXT ------------------ */

export const OrderContext = createContext<OrderContextType | null>(null);

/* ------------------ PROVIDER ------------------ */

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  /* İlk yükleme */
  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  /* Her değişimde kaydet */
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  /* Sipariş oluştur */
  const createOrder = (items: OrderItem[], customer: CustomerInfo) => {
    const total = items.reduce(
      (sum, item) =>
        sum + Number(item.price) * (item.quantity ? item.quantity : 1),
      0
    );

    const newOrder: Order = {
      id: uuidv4(),
      items,
      total,
      date: new Date().toLocaleString(),
      customer,
    };

    setOrders((prev) => [...prev, newOrder]);
  };

  /* Sipariş sil (Admin tamamlandı) */
  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  return (
    <OrderContext.Provider
      value={{ orders, createOrder, deleteOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};
