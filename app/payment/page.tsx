"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function PaymentPage() {
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("selectedProduct");

        if (stored) {
            setProduct(JSON.parse(stored));
        } else {
            router.push("/");
        }
    }, []);

    const handlePayment = async () => {
        if (
            !firstName ||
            !lastName ||
            !phone ||
            !cardNumber ||
            !expiry ||
            !cvv
        ) {
            alert("Tüm alanları doldurun!");
            return;
        }

        try {
            await api.post("/orders", {
                productId: product._id,
                quantity: 1,
            });
            alert("Ödeme başarılı ✅ Sipariş oluşturuldu.");

            localStorage.removeItem("selectedProduct");
            router.push("/");
        }
        catch (err: any) {
            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {
                alert("Giriş yapmanız gerekiyor!");
                router.push("/login");
                return;
            }
            if (err.response?.data.message) {
                alert(err.response.data.message);

            } else {
                alert("Siparişiniz oluşturulamadı!");
            }
        }


    };

    if (!product) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-[500px] space-y-4">

                <h1 className="text-2xl font-bold text-center">
                    Ödeme Bilgileri
                </h1>

                <p className="text-center text-gray-300">
                    Ürün: {product.name} — ₺{product.price}
                </p>

                <input
                    placeholder="Ad"
                    className="w-full p-3 rounded bg-white/20 border border-white/30"
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                    placeholder="Soyad"
                    className="w-full p-3 rounded bg-white/20 border border-white/30"
                    onChange={(e) => setLastName(e.target.value)}
                />

                <input
                    placeholder="Telefon"
                    className="w-full p-3 rounded bg-white/20 border border-white/30"
                    onChange={(e) => setPhone(e.target.value)}
                />

                <input
                    placeholder="Kart Numarası"
                    maxLength={16}
                    className="w-full p-3 rounded bg-white/20 border border-white/30"
                    onChange={(e) => setCardNumber(e.target.value)}
                />

                <div className="flex gap-4">
                    <input
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-1/2 p-3 rounded bg-white/20 border border-white/30"
                        onChange={(e) => setExpiry(e.target.value)}
                    />

                    <input
                        placeholder="CVV"
                        maxLength={3}
                        className="w-1/2 p-3 rounded bg-white/20 border border-white/30"
                        onChange={(e) => setCvv(e.target.value)}
                    />
                </div>

                <button
                    onClick={handlePayment}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold"
                >
                    Ödemeyi Tamamla
                </button>
            </div>
        </div>
    );
}