"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function AddProductPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { language } = useLanguage();
    const t = translations[language];

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const addProductMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return await api.post("/products", formData);
        },
        onMutate: () => {
            return toast.loading(t.productAdding);
        },
        onSuccess: (_, __, toastId) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });

            toast.success(t.productAdded, { id: toastId });

            setTimeout(() => {
                router.push("/admin/products");
            }, 700);
        },
        onError: (error: any, _, toastId) => {
            toast.error(
                error?.response?.data?.message || t.productAddFailed,
                { id: toastId }
            );
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            toast.error(t.selectImage);
            return;
        }

        if (Number(price) <= 0) {
            toast.error(t.priceMustBePositive);
            return;
        }

        if (Number(stock) < 0) {
            toast.error(t.stockCannotBeNegative);
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", String(Number(price)));
        formData.append("description", description);
        formData.append("stock", String(Number(stock)));
        formData.append("image", image);

        addProductMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-6 transition-colors">

            <div className="max-w-xl mx-auto 
                      bg-white dark:bg-gray-800
                      text-gray-900 dark:text-white
                      border border-gray-200 dark:border-gray-700
                      p-8 rounded-2xl shadow-xl transition-colors">

                <h1 className="text-2xl font-bold mb-6">
                    {t.addProduct}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        placeholder={t.productName}
                        className="w-full border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700
                       text-gray-900 dark:text-white
                       p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder={t.price}
                        className="w-full border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700
                       text-gray-900 dark:text-white
                       p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder={t.stock}
                        className="w-full border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700
                       text-gray-900 dark:text-white
                       p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder={t.description}
                        className="w-full border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700
                       text-gray-900 dark:text-white
                       p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="w-full border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700
                       text-gray-900 dark:text-white
                       p-3 rounded-lg"
                        onChange={handleImageChange}
                    />

                    {preview && (
                        <div className="mt-4">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-60 object-cover rounded-lg shadow"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={addProductMutation.isPending}
                        className="w-full py-3 rounded-xl font-medium transition disabled:opacity-70
                       bg-green-600 text-white hover:bg-green-700"
                    >
                        {addProductMutation.isPending ? t.addingProduct : t.saveProduct}
                    </button>

                </form>
            </div>
        </div>
    );
}