"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/context/CartContext";

export default function Navbar() {
  const router = useRouter();
  const context = useContext(CartContext);
  const cart = context?.cart || [];

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
      <Link href="/shop" className="text-2xl font-bold tracking-wide">
        TECHNOMARKT
      </Link>

      <div className="flex items-center gap-6">

        {/* Sepet sadece user için */}
        {role === "user" && (
          <Link href="/shop/cart" className="relative hover:text-indigo-400 transition">
            Sepet
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-xs px-2 py-1 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
        )}

        {/* Login yoksa */}
        {!role && (
          <Link href="/login" className="hover:text-indigo-400 transition">
            Giriş
          </Link>
        )}

        {/* Dropdown Menü */}
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
                      href="/my-orders"
                      className="block px-4 py-3 hover:bg-gray-700 transition"
                      onClick={() => setOpen(false)}
                    >
                      Siparişlerim
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
