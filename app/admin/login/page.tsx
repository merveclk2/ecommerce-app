"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/login", { email, password });
            const meRes = await api.get("/me");
            const user = meRes.data;

            if (user.role === "admin") {
                router.replace("/admin/orders");
            } else {
                router.replace("/user/shop");
            }

        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 401) {
                setError("email veya şifre hatalı");
            } else {
                setError("sunucu hatası");

            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <form
                onSubmit={handleLogin}
                className="bg-white/10 p-8 rounded-xl w-96"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">
                    TECHNOMARKT
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 mb-4 rounded bg-white/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Şifre"
                    className="w-full p-3 mb-4 rounded bg-white/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && (
                    <p className="text-red-400 mb-3 text-center">
                        {error}
                    </p>
                )}

                <button
                    disabled={loading}
                    className="w-full bg-indigo-600 py-3 rounded disabled:opacity-50"
                >
                    {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </button>
            </form>
        </div>
    );
}
