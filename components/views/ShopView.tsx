"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import api from "@/lib/axios";
type Product = {
    _id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
};

export default function ShopView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [isUser, setIsUser] = useState(false);

    const router = useRouter();

    const handleBuy = (product: Product) => {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        router.push("/payment");
    };

    // 🔹 Ürünleri çek
    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await api.get("/public-products");
                if (Array.isArray(res.data)) {
                    setProducts(res.data);
                }
            } catch (error) {
                console.log("ürün çekme hatası:");
            }

        };
        getProducts();
    }, []);

    // 🔹 Socket ürün ekleme
    useEffect(() => {
        const socket = io("http://localhost:5000");

        socket.on("newProduct", (product) => {
            setProducts((prev) => {
                const exists = prev.some((p) => p._id === product._id);
                if (exists) return prev;
                return [product, ...prev];
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // 🔐 Favorileri çek (cookie ile)
    useEffect(() => {
        const fetchFavorites = async () => {
            const res = await fetch("http://localhost:5000/favorites", {
                credentials: "include",
            });

            if (res.status === 401 || res.status === 403) {
                return; // login değilse kalp göstermeyeceğiz
            }

            setIsUser(true);

            const data = await res.json();

            if (Array.isArray(data)) {
                setFavorites(data.map((p: any) => p._id));
            }
        };

        fetchFavorites();
    }, []);

    const toggleFavorite = async (productId: string) => {
        const res = await fetch(
            `http://localhost:5000/favorites/${productId}`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        if (res.status === 401 || res.status === 403) {
            router.push("/login");
            return;
        }

        setFavorites((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        if (search) {
            filtered = filtered.filter((product) =>
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
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

    return (
        <div className="min-h-screen bg-[#bdbab3] p-10">

            <div className="max-w-6xl mx-auto mb-10 bg-white p-6 rounded-2xl shadow-md flex flex-wrap gap-4 items-center justify-between">

                <input
                    type="text"
                    placeholder="Ürün ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-4 py-2 rounded-lg w-60"
                />

                <div className="flex gap-3 items-center">
                    <input
                        type="number"
                        placeholder="Min ₺"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="border px-3 py-2 rounded-lg w-24"
                    />

                    <input
                        type="number"
                        placeholder="Max ₺"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="border px-3 py-2 rounded-lg w-24"
                    />
                </div>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border px-4 py-2 rounded-lg"
                >
                    <option value="default">Sırala</option>
                    <option value="asc">Fiyat Artan</option>
                    <option value="desc">Fiyat Azalan</option>
                </select>
            </div>

            <div className="flex gap-10 flex-wrap justify-center">
                {filteredProducts.map((product) => {
                    const isFav = favorites.includes(product._id);

                    return (
                        <div
                            key={product._id}
                            className="relative w-[300px] bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
                        >
                            {/* ❤️ FAVORITE BUTTON */}
                            {isUser && (
                                <button
                                    onClick={() =>
                                        toggleFavorite(product._id)
                                    }
                                    className="absolute top-4 right-4 text-2xl z-10"
                                >
                                    {isFav ? "❤️" : "🤍"}
                                </button>
                            )}

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
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredProducts.length === 0 && (
                <p className="text-center mt-10 text-gray-700">
                    Aramanıza uygun ürün bulunamadı.
                </p>
            )}
        </div>
    );
}
