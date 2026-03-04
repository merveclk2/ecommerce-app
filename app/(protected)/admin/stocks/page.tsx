"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/app/socket";
import api from "@/lib/axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { useAuth } from "@/context/AuthContext";

interface Product {
    _id: string;
    name: string;
    stock: number;
    sold?: number;
}

export default function StocksPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const { language } = useLanguage();
    const { user, loading } = useAuth();
    const t = translations[language];

    // Ürünleri çek
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                setProducts(res.data);
            } catch (err) {
                console.error("ÜRÜNLER ALINAMADI:", err);
            }
        };

        fetchProducts();
    }, []);

    // Socket ile stok güncelleme
    useEffect(() => {
        if (loading || !user) return;

        const socket = getSocket();
        if (!socket) return;

        const handleStockUpdate = (data: { productId: string; stock: number }) => {
            setProducts((prev) =>
                prev.map((p) =>
                    p._id === data.productId ? { ...p, stock: data.stock } : p
                )
            );
        };

        socket.on("stockUpdated", handleStockUpdate);

        return () => {
            socket.off("stockUpdated", handleStockUpdate);
        };
    }, [user, loading]);

    return (
        <div className="p-8 bg-background text-foreground min-h-screen">

            <h1 className="text-3xl font-bold mb-8">
                {t.stockManagement}
            </h1>

            <div className="overflow-x-auto">

                <table className="w-full border border-border bg-card rounded-xl overflow-hidden shadow-lg">

                    <thead>
                        <tr className="bg-muted text-left">
                            <th className="p-4 border border-border">{t.product}</th>
                            <th className="p-4 border border-border">{t.remainingStock}</th>
                            <th className="p-4 border border-border">{t.sold}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product._id}
                                className={`border border-border ${product.stock <= 3
                                        ? "bg-yellow-200 dark:bg-yellow-700"
                                        : "bg-card"
                                    }`}
                            >
                                <td className="p-4 border border-border">
                                    {product.name}
                                </td>

                                <td className="p-4 border border-border font-semibold">
                                    {product.stock}
                                </td>

                                <td className="p-4 border border-border text-green-600 dark:text-green-400 font-semibold">
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