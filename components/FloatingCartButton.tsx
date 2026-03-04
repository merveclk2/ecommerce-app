"use client";

import { useRouter } from "next/navigation";

export default function FloatingCartButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/shop/cart")}
            className="bg-green-600 hover:bg-green-700 
                 text-white w-14 h-14 rounded-full 
                 shadow-lg flex items-center justify-center 
                 text-xl transition-all duration-300"
        >
            🛒
        </button>
    );
}