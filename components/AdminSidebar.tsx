"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/axios";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { useEffect, useState } from "react";
import { getSocket } from "@/app/socket";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [waitingCount, setWaitingCount] = useState(0);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleWaitingList = (list: any[]) => {
      setWaitingCount(list.length);
    };

    socket.on("update_waiting_list", handleWaitingList);

    return () => {
      socket.off("update_waiting_list", handleWaitingList);

    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("logout error:", err);
    }
    router.push("/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    if (path === "/admin/products/add")
      return pathname === "/admin/products/add";
    if (path === "/admin/products")
      return (
        pathname.startsWith("/admin/products") &&
        pathname !== "/admin/products/add"
      );

    return pathname === path;
  };

  const linkStyle = (path: string) =>
    `block w-full px-4 py-2 rounded-lg transition-all duration-200 ${isActive(path)
      ? "bg-gray-800 text-white"
      : "hover:bg-gray-800 hover:text-white text-gray-300"
    }`;

  return (
    <aside className="fixed top-0 left-0 w-64 min-h-screen bg-gray-900 text-white p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-2">
        {t.adminPanel}
      </h2>
      <p className="text-xs text-gray-400 mb-8">👑 ADMIN</p>

      <ul className="space-y-2">
        <li>
          <Link href="/admin" className={linkStyle("/admin")}>
            📊 {t.dashboard}
          </Link>
        </li>

        <li>
          <Link href="/admin/products" className={linkStyle("/admin/products")}>
            📦 {t.products}
          </Link>
        </li>

        <li>
          <Link
            href="/admin/products/add"
            className={linkStyle("/admin/products/add")}
          >
            ➕ {t.addProduct}
          </Link>
        </li>

        <li>
          <Link href="/admin/orders" className={linkStyle("/admin/orders")}>
            🧾 {t.orders}
          </Link>
        </li>

        <li>
          <Link href="/admin/stocks" className={linkStyle("/admin/stocks")}>
            📦 {t.stocks}
          </Link>
        </li>
        <li>
          <Link href="/admin/support" className={linkStyle("/admin/support")}>
            🎧 {t.support} {waitingCount > 0 && `(${waitingCount})`}
          </Link>
        </li>

        <li>
          <Link href="/shop" className={linkStyle("/shop")}>
            🛒 {t.goToShop}
          </Link>
        </li>

        <hr className="border-gray-700 my-4" />

        {/* 🌍 DİL DEĞİŞTİR */}
        <li>
          <button
            onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            {language === "tr" ? "🇬🇧 English" : "🇹🇷 Türkçe"}
          </button>
        </li>

        {/* 🚪 LOGOUT */}
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            🚪 {t.logout}
          </button>
        </li>
      </ul>
    </aside>
  );
}