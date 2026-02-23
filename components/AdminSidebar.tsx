"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

  const isActive = (path: string) => {
    // Dashboard sadece exact match
    if (path === "/admin") {
      return pathname === "/admin";
    }

    // Ürün Ekle sadece exact
    if (path === "/admin/products/add") {
      return pathname === "/admin/products/add";
    }

    // Ürünler ama add değil
    if (path === "/admin/products") {
      return (
        pathname.startsWith("/admin/products") &&
        pathname !== "/admin/products/add"
      );
    }

    // Diğerleri exact match
    return pathname === path;
  };

  const linkStyle = (path: string) =>
    `block w-full px-4 py-2 rounded-lg transition-all duration-200 ${isActive(path)
      ? "bg-gray-800 text-white"
      : "hover:bg-gray-800 hover:text-white text-gray-300"
    }`;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6 fixed shadow-xl">
      <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
      <p className="text-xs text-gray-400 mb-8">👑 ADMIN</p>

      <ul className="space-y-2">

        <li>
          <Link href="/admin" className={linkStyle("/admin")}>
            📊 Dashboard
          </Link>
        </li>

        <li>
          <Link href="/admin/products" className={linkStyle("/admin/products")}>
            📦 Ürünler
          </Link>
        </li>

        <li>
          <Link href="/admin/products/add" className={linkStyle("/admin/products/add")}>
            ➕ Ürün Ekle
          </Link>
        </li>

        <li>
          <Link href="/admin/orders" className={linkStyle("/admin/orders")}>
            🧾 Siparişler
          </Link>
        </li>

        <li>
          <Link href="/admin/stocks" className={linkStyle("/admin/stocks")}>
            📦 Stoklar
          </Link>
        </li>

        <li>
          <Link href="/shop" className={linkStyle("/shop")}>
            🛒 Mağazaya Git
          </Link>
        </li>

        <hr className="border-gray-700 my-4" />

        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            🚪 Çıkış Yap
          </button>
        </li>
      </ul>
    </div>
  );
}