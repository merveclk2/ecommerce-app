"use client";

import AuthGuard from "@/components/AuthGuard";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard role="admin">
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <AdminSidebar />
                <div className="ml-64 p-10 w-full min-h-screen bg-gray-100">
                    {children}
                </div>
            </div>
        </AuthGuard>
    );
}