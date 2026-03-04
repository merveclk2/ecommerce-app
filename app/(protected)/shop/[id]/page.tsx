"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    stock: number;
    image: string;
    sold?: number;
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const t = translations[language];

    const addToCart = useCartStore((state) => state.addToCart);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                toast.error(t.productLoadError || "Ürün yüklenemedi ❌");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        if (product.stock <= 0) {
            toast.error(t.outOfStock || "Bu ürün stokta yok ❌");
            return;
        }

        addToCart(product);
        toast.success(t.addedToCart || "Ürün sepete eklendi 🛒");
    };

    const handleBuyNow = () => {
        if (!product) return;

        if (product.stock <= 0) {
            toast.error(t.outOfStock || "Bu ürün stokta yok ❌");
            return;
        }

        router.push(`/payment?buyNow=${product._id}`);
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {t.loading || "Yükleniyor..."}
                </p>
            </div>
        );

    if (!product)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
                <p className="text-red-500 dark:text-red-400">
                    {t.productNotFound || "Ürün bulunamadı ❌"}
                </p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-16 px-6 transition-colors">
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 grid md:grid-cols-2 gap-12 transition-colors">

                {/* IMAGE */}
                <div className="flex items-center justify-center">
                    <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="w-full max-h-[500px] object-contain rounded-2xl shadow-lg hover:scale-105 transition duration-300"
                    />
                </div>

                {/* INFO */}
                <div className="flex flex-col justify-between">

                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            {product.name}
                        </h1>

                        <p className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mt-4">
                            ₺{product.price}
                        </p>

                        <div className="mt-4 flex items-center gap-4 flex-wrap">

                            <span
                                className={`px-4 py-1 rounded-full text-sm font-medium ${product.stock > 0
                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    }`}
                            >
                                {product.stock > 0
                                    ? `${t.inStock || "Stokta"} (${product.stock})`
                                    : t.outOfStock || "Stokta Yok"}
                            </span>

                            {product.sold !== undefined && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {product.sold} {t.sold || "adet satıldı"}
                                </span>
                            )}

                        </div>

                        <p className="mt-8 text-gray-600 dark:text-gray-300 leading-relaxed">
                            {product.description ||
                                t.defaultDescription ||
                                "Bu ürün yüksek kalite standartlarında üretilmiştir."}
                        </p>
                    </div>

                    {/* BUTTONS */}
                    <div className="mt-10 flex gap-4">

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className="flex-1 py-4 rounded-2xl text-lg font-semibold transition disabled:opacity-50
                            bg-black text-white hover:bg-gray-800
                            dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {t.addToCart || "Sepete Ekle"}
                        </button>

                        <button
                            onClick={handleBuyNow}
                            disabled={product.stock <= 0}
                            className="flex-1 py-4 rounded-2xl text-lg font-semibold transition disabled:opacity-50
                            border border-black text-black hover:bg-black hover:text-white
                            dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                        >
                            ⚡ {t.buyNow || "Hemen Al"}
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}