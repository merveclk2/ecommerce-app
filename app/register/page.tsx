"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Tüm alanları doldurun");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Şifreler eşleşmiyor");
            return;
        }

        if (formData.password.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır");
            return;
        }

        setLoading(true);

        try {
            await api.post("/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            router.push("/");
        } catch (err: any) {
            if (err.repsonse?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("kayıt başarısız");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-xl shadow-lg w-96"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Kayıt Ol
                </h1>

                <input
                    type="text"
                    placeholder="İsim"
                    className="w-full p-3 mb-4 border rounded"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 mb-4 border rounded"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Şifre (en az 6 karakter)"
                    className="w-full p-3 mb-4 border rounded"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Şifre Tekrar"
                    className="w-full p-3 mb-4 border rounded"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                        })
                    }
                />

                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 disabled:bg-gray-400 transition"
                >
                    {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                </button>

                <p className="text-center mt-4 text-sm text-gray-600">
                    Zaten hesabınız var mı?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Giriş Yap
                    </Link>
                </p>
            </form>
        </div>
    );
}
