"use client";

import { useAuth } from "@/context/AuthContext";
import FloatingCartButton from "@/components/FloatingCartButton";
import SupportButton from "@/components/SupportButton";

export default function FloatingActions() {
    const { user } = useAuth();

    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">

            {/* Destek butonu sadece normal kullanıcıya */}
            {user && user.role === "user" && <SupportButton />}

            {/* Sepet butonu */}
            <FloatingCartButton />

        </div>
    );
}