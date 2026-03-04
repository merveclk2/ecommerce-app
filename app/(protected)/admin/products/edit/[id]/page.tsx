"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { language } = useLanguage();
    const t = translations[language];

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["product", id],
        staleTime: 1000 * 60 * 10,
        queryFn: async () => {
            const res = await api.get(`/products/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    useEffect(() => {
        if (data) {
            setName(data.name);
            setPrice(data.price);
            setDescription(data.description);
            setImage(data.image);
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: async () => {
            return await api.put(`/products/${id}`, {
                name,
                price: Number(price),
                description,
                image,
            });
        },
        onMutate: () => {
            return toast.loading(t.updatingProduct);
        },
        onSuccess: (_, __, toastId) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product", id] });

            toast.success(t.productUpdated, { id: toastId });

            setTimeout(() => {
                router.push("/admin/products");
            }, 800);
        },
        onError: (err: any, _, toastId) => {
            toast.error(
                err?.response?.data?.message || t.updateFailed,
                { id: toastId }
            );
        },
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate();
    };

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
                <p className="text-gray-600 dark:text-gray-300">
                    {t.loading}
                </p>
            </div>
        );

    if (isError)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
                <p className="text-red-500 dark:text-red-400">
                    {t.productLoadError}
                </p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-6 transition-colors">
            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 p-8 rounded-2xl shadow-xl transition-colors">

                <h1 className="text-2xl font-bold mb-6">
                    {t.editProduct}
                </h1>

                <form onSubmit={handleUpdate} className="space-y-4">

                    <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />

                    <textarea
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <input
                        type="text"
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="w-full py-3 rounded-xl font-medium transition disabled:opacity-70
                       bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {updateMutation.isPending ? t.updating : t.update}
                    </button>

                </form>
            </div>
        </div>
    );
}