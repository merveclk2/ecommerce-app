"use client";

import { useContext } from "react";
import { ProductContext } from "@/context/ProductContext";
import { CartContext } from "@/context/CartContext";
import { useParams } from "next/navigation";

export default function ProductDetail() {
  const productContext = useContext(ProductContext);
  const cartContext = useContext(CartContext);
  const params = useParams();

  if (!productContext || !cartContext) return null;

  const { products } = productContext;
  const { addToCart } = cartContext;

  const product = products.find((p) => p.id === params.id);

  if (!product) return <p>Ürün bulunamadı</p>;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 flex gap-8">
        {product.image && (
          <img
            src={product.image}
            className="w-80 h-80 object-cover rounded"
          />
        )}

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl text-gray-600 mt-2">
            {product.price} TL
          </p>

          <p className="mt-4">{product.description}</p>

          <div className="mt-4">
            <strong>Özellikler:</strong>
            <p>{product.features}</p>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="mt-6 bg-black text-white px-6 py-2 rounded"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
