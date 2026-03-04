"use client";

import { AuthProvider } from "@/context/AuthContext";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProvider>{children}</AuthProvider>;
}