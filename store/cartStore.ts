import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Product = {
    _id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
};

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    cartItems: CartItem[];
    addToCart: (product: Product) => void; // ✅ BURASI DEĞİŞTİ
    decreaseQuantity: (_id: string) => void;
    removeFromCart: (_id: string) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cartItems: [],

            addToCart: (product) => {
                const existing = get().cartItems.find(
                    (item) => item._id === product._id
                );

                if (existing) {
                    set({
                        cartItems: get().cartItems.map((item) =>
                            item._id === product._id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({
                        cartItems: [
                            ...get().cartItems,
                            { ...product, quantity: 1 },
                        ],
                    });
                }
            },

            decreaseQuantity: (_id) => {
                set({
                    cartItems: get()
                        .cartItems
                        .map((item) =>
                            item._id === _id
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                });
            },

            removeFromCart: (_id) => {
                set({
                    cartItems: get().cartItems.filter(
                        (item) => item._id !== _id
                    ),
                });
            },

            clearCart: () => set({ cartItems: [] }),
        }),
        {
            name: "cart-storage",
        }
    )
);