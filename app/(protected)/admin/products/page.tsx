"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

type Product = {
    _id: string;
    name: string;
    price: number;
    image?: string;
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();

    const { language } = useLanguage();
    const t = translations[language];

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products");

            if (Array.isArray(res.data)) {
                setProducts(res.data);
            }
        } catch (err: any) {
            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                router.push("/login");
                return;
            }

            toast.error(t.fetchError);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        const toastId = toast.loading(t.deleting);

        try {
            await api.delete(`/products/${id}`);

            setProducts((prev) =>
                prev.filter((product) => product._id !== id)
            );

            toast.success(t.deleted, { id: toastId });

        } catch (err: any) {
            toast.error(t.deleteError, { id: toastId });
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 space-y-6 px-4">

            <h1 className="text-3xl font-bold">{t.products}</h1>

            {products.length === 0 && (
                <div className="bg-gray-100 p-6 rounded-xl text-center text-gray-500">
                    {t.noProducts}
                </div>
            )}

            {products.map((product) => (
                <div
                    key={product._id}
                    className="bg-white p-5 rounded-2xl shadow flex justify-between items-center hover:shadow-lg transition"
                >
                    <div className="flex items-center gap-4">

                        {product.image && (
                            <img
                                src={`http://localhost:5000${product.image}`}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                        )}

                        <div>
                            <h2 className="font-bold text-lg">
                                {product.name}
                            </h2>
                            <p className="text-gray-600">
                                ₺{product.price}
                            </p>
                        </div>
                    </div>

                    <div className="space-x-2">
                        <Link
                            href={`/admin/products/edit/${product._id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            {t.edit}
                        </Link>

                        <button
                            onClick={() => handleDelete(product._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            {t.delete}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}