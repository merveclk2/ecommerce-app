"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
    children: React.ReactNode;
    role?: "admin" | "user";
}

export default function AuthGuard({ children, role }: Props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        if (role && user.role !== role) {
            router.replace("/");
            return;
        }
    }, [user, loading, role, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Kontrol ediliyor...</p>
            </div>
        );
    }

    if (!user) return null;
    if (role && user.role !== role) return null;

    return <>{children}</>;
}
