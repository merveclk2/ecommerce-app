"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function FloatingCart() {
    const router = useRouter();

    const cartItems = useCartStore((state) => state.cartItems);
    const totalQuantity = cartItems.reduce(
        (total, item) => total + item.quantity, 0
    );


    return (
        <div
            onClick={() => router.push("/shop/cart")}
            className="fixed bottom-6 right-6 z-50 cursor-pointer"
        >
            <div className="relative">

                {/* Icon */}
                <div className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
                    🛒
                </div>

                {/* Badge */}
                {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
                        {totalQuantity}
                    </span>
                )}

            </div>
        </div>
    );
}

