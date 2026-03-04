"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // ⏳ Loading toast
        const toastId = toast.loading("Giriş yapılıyor...");

        try {
            // 🔐 LOGIN
            await api.post("/login", { email, password });

            // 👤 USER BİLGİSİ
            const meRes = await api.get("/me");
            const user = meRes.data;

            // ✅ Success toast
            toast.success("Giriş başarılı 🎉", { id: toastId });

            // 🔁 ROUTE
            if (user.role === "admin") {
                router.replace("/admin/orders");
            } else {
                router.replace("/shop");
            }

        } catch (err: any) {

            if (err.response?.status === 401) {
                toast.error("Email veya şifre hatalı", { id: toastId });
            } else if (err.response?.data?.message) {
                toast.error(err.response.data.message, { id: toastId });
            } else {
                toast.error("Sunucu hatası", { id: toastId });
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-text">

            <div className="bg-white shadow-xl rounded-2xl p-10 w-[380px] border border-rose-200">

                <h1 className="text-3xl font-semibold text-center mb-8 tracking-wide">
                    TECHNOMARKET
                </h1>

                <form onSubmit={handleLogin} className="space-y-6">

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                    />

                    <input
                        type="password"
                        placeholder="Şifre"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium transition disabled:opacity-70"
                    >
                        {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                    </button>

                </form>
            </div>
        </div>
    );
}