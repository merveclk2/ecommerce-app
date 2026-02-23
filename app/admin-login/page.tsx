"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await api.post("/login", { email, password });

            const user = res.data;

            if (user.role !== "admin") {
                alert("Admin bilgileri hatalı!");
                return;
            }

            router.push("/admin/orders");

        } catch (err: any) {
            alert("Giriş başarısız!");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-2xl shadow-2xl w-[420px] space-y-6 text-white">

                <h1 className="text-3xl font-bold text-center tracking-widest">
                    ADMIN PANEL
                </h1>

                <input
                    placeholder="Email"
                    className="w-full bg-white/10 border border-white/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Şifre"
                    className="w-full bg-white/10 border border-white/30 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-red-600 hover:bg-red-700 transition duration-300 py-3 rounded-lg font-semibold tracking-wide"
                >
                    Admin Giriş
                </button>
            </div>
        </div>
    );
}
