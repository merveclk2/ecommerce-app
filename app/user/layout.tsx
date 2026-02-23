"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    if (loading) return null;

    if (!user || user.role !== "user") {
        router.replace("/login");
        return null;
    }

    return (
        <div className="flex">

            {/* USER SIDEBAR */}
            <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed">
                <h2 className="text-xl font-bold mb-8">Kullanıcı Paneli</h2>

                <ul className="space-y-4">
                    <li>
                        <button onClick={() => router.push("/user/shop")}>
                            🛒 Mağaza
                        </button>
                    </li>

                    <li>
                        <button onClick={() => router.push("/user/my-orders")}>
                            📦 Siparişlerim
                        </button>
                    </li>

                    <li>
                        <button onClick={() => router.push("/user/favorites")}>
                            ❤️ Favorilerim
                        </button>
                    </li>

                    <li>
                        <button onClick={logout} className="text-red-400">
                            🚪 Çıkış Yap
                        </button>
                    </li>
                </ul>
            </div>

            <div className="ml-64 p-10 w-full min-h-screen bg-gray-100">
                {children}
            </div>
        </div>
    );
}
