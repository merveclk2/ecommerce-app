"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const buyNowId = searchParams.get("buyNow");
    const isCartPayment = searchParams.get("cart");

    const { language } = useLanguage();
    const t = translations[language];

    const cartItems = useCartStore((state) => state.cartItems);
    const clearCart = useCartStore((state) => state.clearCart);

    const [loading, setLoading] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    useEffect(() => {
        if (!buyNowId && !isCartPayment) {
            router.push("/");
        }
    }, [buyNowId, isCartPayment, router]);

    const handlePayment = async () => {
        if (!firstName || !lastName || !phone || !cardNumber || !expiry || !cvv) {
            toast.error(t.fillAllFields);
            return;
        }

        setLoading(true);
        const toastId = toast.loading(t.paymentProcessing);

        try {
            if (buyNowId) {
                // 🔥 Tek ürün
                await api.post("/orders", {
                    productId: buyNowId,
                    quantity: 1,
                });
            }

            if (isCartPayment) {
                // 🔥 Sepetteki tüm ürünler
                for (const item of cartItems) {
                    await api.post("/orders", {
                        productId: item._id,
                        quantity: item.quantity,
                    });
                }

                clearCart();
            }

            toast.success(t.paymentSuccess, { id: toastId });

            setTimeout(() => {
                router.push("/");
            }, 1000);

        } catch (err: any) {
            toast.error(
                err.response?.data?.message || t.orderFailed,
                { id: toastId }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-[500px] space-y-4">

                <h1 className="text-2xl font-bold text-center">
                    {t.paymentTitle}
                </h1>

                <input
                    placeholder={t.firstName}
                    className="w-full p-3 rounded bg-white/20 border border-white/30"
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                    placeholder={t.lastName}
                    className="w-full p-3 rounded bg-white/20 border border-white/30"
                    onChange={(e) => setLastName(e.target.value)}
                />

                <input
                    placeholder={t.phone}
                    className="w-full p-3 rounded bg-white/20 border border-white/30"
                    onChange={(e) => setPhone(e.target.value)}
                />

                <input
                    placeholder={t.cardNumber}
                    maxLength={16}
                    className="w-full p-3 rounded bg-white/20 border border-white/30"
                    onChange={(e) => setCardNumber(e.target.value)}
                />

                <div className="flex gap-4">
                    <input
                        placeholder={t.expiry}
                        maxLength={5}
                        className="w-1/2 p-3 rounded bg-white/20 border border-white/30"
                        onChange={(e) => setExpiry(e.target.value)}
                    />

                    <input
                        placeholder={t.cvv}
                        maxLength={3}
                        className="w-1/2 p-3 rounded bg-white/20 border border-white/30"
                        onChange={(e) => setCvv(e.target.value)}
                    />
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold disabled:opacity-60"
                >
                    {loading ? t.processing : t.completePayment}
                </button>

            </div>
        </div>
    );
}