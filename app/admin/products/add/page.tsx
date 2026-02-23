"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("stock", stock);

    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Ürün eklendi ✅");
      router.push("/admin/products");

    } catch (err) {
      console.error("Ürün ekleme hatası:", err);
      alert("Ürün eklenemedi ❌");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow mt-10">
      <h1 className="text-2xl font-bold mb-6">Ürün Ekle</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Ürün Adı"
          className="w-full border p-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Fiyat"
          className="w-full border p-3 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Stok"
          className="w-full border p-3 rounded"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />

        <textarea
          placeholder="Açıklama"
          className="w-full border p-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/png, image/jpeg"
          className="w-full border p-3 rounded"
          onChange={handleImageChange}
        />

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-60 object-cover rounded-lg shadow"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded w-full hover:bg-green-700 transition"
        >
          Ürünü Kaydet
        </button>
      </form>
    </div>
  );
}