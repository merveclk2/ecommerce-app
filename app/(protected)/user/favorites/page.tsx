"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type Product = {
    _id: string;
    name: string;
    price: number;
    image?: string;
};

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const router = useRouter();

    const fetchFavorites = async () => {
        try {
            const res = await api.get("favorites");

            if (Array.isArray(res.data)) {
                setFavorites(res.data);
            }
        } catch (err: any) {
            if (err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                router.push("/login");
                return;
            }
            console.error("favoriler alınamadı", err);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const removeFavorite = async (productId: string) => {
        try {
            await api.post(`/favorites/${productId}`);

            setFavorites((prev) =>
                prev.filter((p) => p._id !== productId));

        } catch (err: any) {
            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                router.push("/login");
                return;
            }
            console.error("Favori silme hatası:", err);
        }
    };

    const handleBuy = (product: Product) => {
        localStorage.setItem(
            "selectedProduct",
            JSON.stringify(product)
        );
        router.push("/payment");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-gray-900">
                    ❤️ Favorilerim
                </h1>

                {favorites.length === 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow text-center">
                        <p className="text-gray-600 text-lg">
                            Henüz favori ürününüz yok.
                        </p>
                    </div>
                )}

                <div className="flex gap-10 flex-wrap justify-center">
                    {favorites.map((product) => (
                        <div
                            key={product._id}
                            className="w-[300px] bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                        >
                            <div className="h-[230px] bg-gray-200 overflow-hidden">
                                <img
                                    src={
                                        product.image
                                            ? `http://localhost:5000${product.image}`
                                            : "https://via.placeholder.com/300"
                                    }
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-800">
                                        {product.name}
                                    </h2>
                                    <span className="font-bold text-black">
                                        ₺{product.price}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleBuy(product)}
                                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                                >
                                    Satın Al
                                </button>

                                <button
                                    onClick={() => removeFavorite(product._id)}
                                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Favoriden Çıkar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}