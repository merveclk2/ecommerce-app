"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string;
  image: string;
  stock: number;
  quantity?: number;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updated: Omit<Product, "id">) => void;
}

export const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // İlk yükleme
  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  // Her değişimde kaydet
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: uuidv4() };
    setProducts((prev) => [...prev, newProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (id: string, updated: Omit<Product, "id">) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updated } : p
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, deleteProduct, updateProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};
