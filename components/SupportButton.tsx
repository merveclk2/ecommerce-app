"use client";

import { useRouter } from "next/navigation";

export default function SupportButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/user/support")}
            className="bg-blue-600 hover:bg-blue-700 
                 text-white w-14 h-14 rounded-full 
                 shadow-lg flex items-center justify-center 
                 text-xl transition-all duration-300"
        >
            💬
        </button>
    );
}