"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ShopView from "@/components/views/ShopView";
import { useAuth } from "@/context/AuthContext";

export default function ShopPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  // 🔥 ÖNEMLİ
  if (loading) return null;

  return (
    <div className="min-h-screen bg-white text-black relative">

      {/* HAMBURGER */}
      <button
        onClick={() => setMenuOpen(true)}
        className="fixed top-6 left-6 z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${menuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 z-40 shadow-xl`}
      >
        <div className="p-6 space-y-6">

          {/* CLOSE */}
          <button
            onClick={() => setMenuOpen(false)}
            className="text-right w-full text-gray-400"
          >
            ✕
          </button>

          {/* ROLE HEADER */}
          {user && (
            <div>
              <h2 className="text-xl font-bold">
                {user.role === "admin" ? "Admin Panel" : "User Panel"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {user.role === "admin" ? "👑 ADMIN" : "👤 USER"}
              </p>
              <hr className="border-gray-700 my-4" />
            </div>
          )}

          {/* USER MENU */}
          {user?.role === "user" && (
            <button
              onClick={() => {
                router.push("/my-orders");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 hover:translate-x-1 transition-all duration-200 cursor-pointer"


            >
              📦 Siparişlerim
            </button>
          )}

          {/* FAVORITES (Her iki role de açık) */}
          {user && (
            <button
              onClick={() => {
                router.push("/favorites");
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 hover:translate-x-1 transition-all duration-200 cursor-pointer"


            >
              ❤️ Favorilerim
            </button>
          )}

          {/* ADMIN MENU */}
          {user?.role === "admin" && (
            <>
              <button
                onClick={() => {
                  router.push("/admin/orders");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 hover:translate-x-1 transition-all duration-200 cursor-pointer"


              >
                📊 Tüm Siparişler
              </button>

              <button
                onClick={() => {
                  router.push("/admin");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 hover:translate-x-1 transition-all duration-200 cursor-pointer"


              >
                🛠 Ürün Yönetimi
              </button>
            </>
          )}

          {/* LOGOUT */}
          {user && (
            <>
              <hr className="border-gray-700 my-4" />
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 hover:translate-x-1 transition-all duration-200 cursor-pointer"


              >
                🚪 Çıkış Yap
              </button>
            </>
          )}

          {/* GUEST */}
          {!user && (
            <button
              onClick={() => router.push("/login")}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-800 hover:translate-x-1 transition-all duration-200 cursor-pointer"

            >
              🔐 Giriş Yap
            </button>
          )}

        </div>
      </div>

      {/* HEADER */}
      <div className="text-center py-10 border-b">
        <h1 className="text-4xl font-bold tracking-wide">
          TECHNOMARKT
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          Teknoloji Ürünleri Mağazası
        </p>
      </div>

      {/* PRODUCTS */}
      <div className="p-10">
        <ShopView />
      </div>

    </div>
  );
}
