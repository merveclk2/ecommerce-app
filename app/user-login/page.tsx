"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function UserLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await api.post("/login", { email, password });

            const user = res.data;

            if (user.role !== "user") {
                alert("kullanıcı bilgileri hatalı");
                return;
            }
            router.push("/");
        } catch (err: any) {
            alert("giriş başarısız");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-black">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl w-[420px] space-y-6 text-white">

                <h1 className="text-3xl font-bold text-center tracking-widest">
                    TECHNOMARKT
                </h1>

                <p className="text-center text-sm text-gray-300">
                    Hesabınıza giriş yapın
                </p>

                <input
                    placeholder="Email"
                    className="w-full bg-white/10 border border-white/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Şifre"
                    className="w-full bg-white/10 border border-white/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 py-3 rounded-lg font-semibold tracking-wide"
                >
                    Giriş Yap
                </button>
            </div>
        </div>
    );
}
