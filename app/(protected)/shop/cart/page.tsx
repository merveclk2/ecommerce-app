"use client";

import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();

    const cartItems = useCartStore((state) => state.cartItems);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
    const addToCart = useCartStore((state) => state.addToCart);

    const total = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    return (
        <div className="min-h-screen py-16 px-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold mb-10">Sepetim</h1>

                {cartItems.length === 0 ? (
                    <p>Sepet boş.</p>
                ) : (
                    <>
                        <div className="space-y-6 mb-12">
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-6">
                                        {item.image && (
                                            <img
                                                src={`http://localhost:5000${item.image}`}
                                                className="w-24 h-24 object-cover rounded-xl shadow"
                                            />
                                        )}

                                        <div>
                                            <h2 className="font-semibold text-lg">
                                                {item.name}
                                            </h2>
                                            <p>
                                                {item.price} TL x {item.quantity}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => decreaseQuantity(item._id)}
                                            className="px-3 py-1 rounded-lg bg-gray-200"
                                        >
                                            -
                                        </button>

                                        <span className="font-semibold">
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() => addToCart(item)}
                                            className="px-3 py-1 rounded-lg bg-gray-200"
                                        >
                                            +
                                        </button>

                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="px-4 py-1 rounded-lg bg-red-500 text-white"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-2xl font-semibold mb-6">
                            Toplam: {total} TL
                        </h2>

                        {/* ✅ YENİ BUTON */}
                        <button
                            onClick={() => {
                                if (cartItems.length === 0) {
                                    toast.error("Sepet boş");
                                    return;
                                }

                                router.push("/payment?cart=true");
                            }}
                            className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                            💳 Ödemeye Geç
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}