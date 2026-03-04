"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {

  const router = useRouter();

  // Zustand cart
  const cartItems = useCartStore((state) => state.cartItems);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Persist hydration fix
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    router.push("/login");
  };

  return (
    <div className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">

      {/* LOGO */}
      <Link href="/shop" className="text-2xl font-bold tracking-wide">
        TECHNOMARKT
      </Link>

      <div className="flex items-center gap-6">

        {/* 🛒 USER CART */}
        {role === "user" && (
          <Link
            href="/cart"
            className="relative hover:text-indigo-400 transition text-xl"
          >
            🛒

            {mounted && totalQuantity > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </Link>
        )}

        {/* LOGIN */}
        {!role && (
          <Link href="/login" className="hover:text-indigo-400 transition">
            Giriş
          </Link>
        )}

        {/* DROPDOWN */}
        {role && (
          <div className="relative">

            <button
              onClick={() => setOpen(!open)}
              className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              {role === "admin" ? "👑" : "👤"}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">

                {role === "user" && (
                  <>
                    <Link
                      href="/user/profile"
                      className="block px-4 py-3 hover:bg-gray-700 transition"
                      onClick={() => setOpen(false)}
                    >
                      👤 Profilim
                    </Link>

                    <Link
                      href="/user/my-orders"
                      className="block px-4 py-3 hover:bg-gray-700 transition"
                      onClick={() => setOpen(false)}
                    >
                      📦 Siparişlerim
                    </Link>

                    <Link
                      href="/user/favorites"
                      className="block px-4 py-3 hover:bg-gray-700 transition"
                      onClick={() => setOpen(false)}
                    >
                      ❤️ Favorilerim
                    </Link>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <Link
                      href="/admin/orders"
                      className="block px-4 py-3 hover:bg-gray-700 transition"
                      onClick={() => setOpen(false)}
                    >
                      Tüm Siparişler
                    </Link>

                    <Link
                      href="/admin"
                      className="block px-4 py-3 hover:bg-gray-700 transition"
                      onClick={() => setOpen(false)}
                    >
                      Ürün Yönetimi
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-600 transition"
                >
                  Çıkış Yap
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}