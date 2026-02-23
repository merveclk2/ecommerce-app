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
      <div className="flex">
        <AdminSidebar />
        <div className="ml-64 p-10 w-full min-h-screen bg-gray-100">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
