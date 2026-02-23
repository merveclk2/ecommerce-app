"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  // ✅ Ürünleri çek
  const fetchProducts = async () => {
    try {
      const res = await api.get("/admin/products");

      if (Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (err: any) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        router.push("/login");
        return;
      }

      console.error("Ürünler alınamadı:", err);
    }
  };

  // ✅ Sayfa açılınca ürünleri getir
  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Ürün sil
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/products/${id}`);

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      );

    } catch (err: any) {
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        router.push("/login");
        return;
      }

      console.error("Silme hatası:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Ürünler</h1>

      {products.length === 0 && (
        <p>Henüz ürün yok.</p>
      )}

      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
        >
          <div>
            <h2 className="font-bold text-lg">{product.name}</h2>
            <p>{product.price} TL</p>
          </div>

          <div className="space-x-2">
            <Link
              href={`/admin/products/edit/${product._id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Düzenle
            </Link>

            <button
              onClick={() => handleDelete(product._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}