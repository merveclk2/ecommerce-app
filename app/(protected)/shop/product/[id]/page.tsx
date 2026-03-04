"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { useCartStore } from "@/store/cartStore";

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const { language } = useLanguage();
  const t = translations[language];

  // ✅ Zustand
  const addToCart = useCartStore((state) => state.addToCart);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", params.id],
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      const res = await api.get(`/products/${params.id}`);
      return res.data;
    },
    enabled: !!params.id,
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t.productLoading}
        </p>
      </div>
    );

  if (isError || !product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-500">
          {t.productNotFound}
        </p>
      </div>
    );

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(t.addedToCart);
  };

  const handleBuyNow = () => {
    router.push(`/payment?buyNow=${product._id}`);
  };

  return (
    <div className="min-h-screen py-16 px-6 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.push("/shop")}
          className="mb-8 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
        >
          ← {t.backToProducts}
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row gap-10">

          {/* Image */}
          {product.image && (
            <div className="flex justify-center md:justify-start">
              <img
                src={product.image}
                className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-xl shadow-md"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-col justify-between flex-1">

            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>

              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-4">
                {product.price} TL
              </p>

              <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>

              {product.features && (
                <div className="mt-6 text-gray-700 dark:text-gray-300">
                  <strong>{t.features}</strong>
                  <p className="mt-2">{product.features}</p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-10 flex flex-col md:flex-row gap-4">

              {/* Sepete Ekle */}
              <button
                onClick={handleAddToCart}
                className="px-8 py-3 rounded-xl font-medium transition
                bg-black text-white hover:bg-gray-800
                dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {t.addToCart}
              </button>

              {/* Hemen Al */}
              <button
                onClick={handleBuyNow}
                className="px-8 py-3 rounded-xl font-medium border border-black
                text-black hover:bg-black hover:text-white transition
                dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                ⚡ {t.buyNow ?? "Hemen Al"}
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}