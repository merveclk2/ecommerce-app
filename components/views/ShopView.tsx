"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/store/cartStore";
import { toast } from "sonner";

export default function ShopView() {
    const router = useRouter();
    const { language } = useLanguage();
    const t = translations[language];

    const addToCart = useCartStore((state) => state.addToCart);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const { data: products = [], isLoading, isError } = useQuery<Product[]>({
        queryKey: ["products"],
        staleTime: 1000 * 60 * 10,
        queryFn: async () => {
            const res = await api.get("/public-products");
            return res.data;
        },
    });

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        if (search) {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (minPrice) {
            filtered = filtered.filter(
                (product) => product.price >= Number(minPrice)
            );
        }

        if (maxPrice) {
            filtered = filtered.filter(
                (product) => product.price <= Number(maxPrice)
            );
        }

        if (sort === "asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === "desc") {
            filtered.sort((a, b) => b.price - a.price);
        }

        return filtered;
    }, [products, search, sort, minPrice, maxPrice]);

    if (isLoading) {
        return <p className="text-center mt-10">{t.loadingProducts}</p>;
    }

    if (isError) {
        return <p className="text-center mt-10">{t.fetchError}</p>;
    }

    return (
        <div className="min-h-screen bg-[#bdbab3] dark:bg-gray-900 p-10 transition-colors duration-300">

            {/* FILTER BAR */}
            <div className="max-w-6xl mx-auto mb-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-wrap gap-4 items-center justify-between">

                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border dark:border-gray-600 px-4 py-2 rounded-lg w-60 dark:bg-gray-700 dark:text-white"
                />

                <div className="flex gap-3 items-center">
                    <input
                        type="number"
                        placeholder={t.minPrice}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="border dark:border-gray-600 px-3 py-2 rounded-lg w-24 dark:bg-gray-700 dark:text-white"
                    />

                    <input
                        type="number"
                        placeholder={t.maxPrice}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border dark:border-gray-600 px-3 py-2 rounded-lg w-24 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border dark:border-gray-600 px-4 py-2 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                    <option value="default">{t.sort}</option>
                    <option value="asc">{t.priceAsc}</option>
                    <option value="desc">{t.priceDesc}</option>
                </select>
            </div>

            {/* PRODUCT GRID */}
            <div className="flex gap-10 flex-wrap justify-center">
                {filteredProducts.map((product) => (
                    <div
                        key={product._id}
                        className="w-[300px] bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                    >

                        {/* IMAGE → DETAIL */}
                        <Link href={`/shop/${product._id}`}>
                            <div className="h-[230px] bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer">
                                <img
                                    src={
                                        product.image
                                            ? `http://localhost:5000${product.image}`
                                            : "https://via.placeholder.com/300"
                                    }
                                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                />
                            </div>
                        </Link>

                        {/* CONTENT */}
                        <div className="p-5 space-y-3">
                            <div className="flex justify-between items-center">
                                <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                                    {product.name}
                                </h2>
                                <span className="font-bold text-black dark:text-white">
                                    ₺{product.price}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">

                                {/* 🛒 Sepete Ekle */}
                                <button
                                    onClick={() => {
                                        addToCart(product);
                                        toast.success(t.addedToCart);
                                    }}
                                    className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                                >
                                    🛒 {t.addToCart}
                                </button>

                                {/* ⚡ Hemen Al */}
                                <button
                                    onClick={() => {
                                        router.push(`/payment?buyNow=${product._id}`);
                                    }}
                                    className="w-full border border-black dark:border-white text-black dark:text-white py-2 rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                                >
                                    ⚡ {t.buyNow ?? "Hemen Al"}
                                </button>

                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <p className="text-center mt-10 text-gray-700 dark:text-gray-300">
                    {t.noProducts}
                </p>
            )}
        </div>
    );
}