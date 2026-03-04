"use client";

import { useState } from "react";
import { Product } from "@/context/ProductContext";

interface Props {
  onSubmit: (data: Omit<Product, "id">) => void;
  initialData?: Omit<Product, "id">;
}

export default function ProductForm({ onSubmit, initialData }: Props) {
  const [form, setForm] = useState<Omit<Product, "id">>(
    initialData || {
      name: "",
      price: 0,
      description: "",
      features: "",
      image: "",
      stock: 0,
    }
  );

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4 max-w-xl text-gray-900 dark:text-gray-100">
      <input
        className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white"
        placeholder="Ürün Adı"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="number"
        className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white"
        placeholder="Fiyat"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: Number(e.target.value) })
        }
      />

      <input
        type="number"
        className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white"
        placeholder="Stok"
        value={form.stock}
        onChange={(e) =>
          setForm({ ...form, stock: Number(e.target.value) })
        }
      />

      <textarea
        className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white"
        placeholder="Açıklama"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <textarea
        className="w-full border dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white"
        placeholder="Özellikler"
        value={form.features}
        onChange={(e) => setForm({ ...form, features: e.target.value })}
      />

      <input type="file" onChange={handleImage} />

      <button
        onClick={() => onSubmit(form)}
        className="bg-black dark:bg-white text-white dark:text-black font-medium px-4 py-2 rounded"
      >
        Kaydet
      </button>
    </div>
  );
}
