"use client";

import { useEffect, useState } from "react";
import socket from "../../socket";
import api from "@/lib/axios";


interface Product {
    _id: string;
    name: string;
    stock: number;
    sold?: number;
}

export default function StocksPage() {
    const [products, setProducts] = useState<Product[]>([]);

    // 🔹 Ürünleri çek
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                setProducts(res.data);
            } catch (err) {
                console.error("ÜRÜNLER ALINAMADI:", err)
            }
        };
        fetchProducts();

    }, []);
    // 🔹 Socket ile canlı stok güncelleme
    useEffect(() => {
        socket.on("stockUpdated", (data) => {
            setProducts(prev =>
                prev.map(p =>
                    p._id === data.productId
                        ? { ...p, stock: data.stock }
                        : p
                )
            );
        });

        return () => {
            socket.off("stockUpdated");
        };
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Stok Yönetimi</h1>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse shadow-lg rounded-xl overflow-hidden">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-4 border">Ürün</th>
                            <th className="p-4 border">Kalan Stok</th>
                            <th className="p-4 border">Satılan</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product._id}
                                className={`border ${product.stock <= 3
                                    ? "bg-yellow-100"
                                    : "bg-white"
                                    }`}
                            >
                                <td className="p-4 border">{product.name}</td>

                                <td className="p-4 border font-semibold">
                                    {product.stock}
                                </td>

                                <td className="p-4 border text-green-600 font-semibold">
                                    {product.sold || 0}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
