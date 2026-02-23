"use client";

import { useState } from "react";
import { Product } from "@/context/ProductContext";

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const [quantity, setQuantity] = useState(1);
export default function ProductCard({
    product,
    onAddToCart,
}: ProductCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 border border-gray-100">

            {/* Ürün Görsel Alanı */}
            <div className="h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                {product.image ? (
                    <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400 text-4xl">📦</span>
                )}
            </div>

            {/* Ürün Bilgisi */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {product.name}
            </h2>

            <p className="text-xl font-bold text-green-600 mb-4">
                ₺{product.price}
            </p>
            <p className="text-sm text-gray-500 mb-2">
                Stok: {product.stock}
            </p>


            {/* Sepet Butonu */}
            <div className="mb-3">
                <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2"
                />
            </div>

            <button
                disabled={product.stock === 0}
                onClick={() => onAddToCart({ ...product, quantity })}
                className={`w-full py-2 px-4 rounded-lg transition duration-200 ${product.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
            >
                {product.stock === 0 ? "Tükendi" : "Sepete Ekle"}
            </button>

        </div>
    );
}
