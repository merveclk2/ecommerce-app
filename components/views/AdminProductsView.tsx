"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
};

export default function AdminProductsView() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Ürünler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("silme işlemi hatası:", err);
    }
  };

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white dark:bg-gray-800 dark:text-gray-100 p-4 rounded shadow flex justify-between"
        >
          <div>
            <h2 className="font-bold">{product.name}</h2>
            <p>{product.price} TL</p>
          </div>

          <button
            onClick={() => handleDelete(product._id)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sil
          </button>
        </div>
      ))}
    </div>
  );
}
