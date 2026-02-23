"use client";

import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { OrderContext, CustomerInfo } from "@/context/OrderContext";

export default function CartPage() {
  const cartContext = useContext(CartContext);
  const orderContext = useContext(OrderContext);

  if (!cartContext || !orderContext) return null;

  const {
    cart,
    removeFromCart,
    decreaseQuantity,
    addToCart,
    clearCart,
  } = cartContext;

  const { createOrder } = orderContext;

  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleOrder = () => {
    if (cart.length === 0) {
      alert("Sepet boş!");
      return;
    }

    if (
      !customer.firstName ||
      !customer.lastName ||
      !customer.phone ||
      !customer.cardNumber ||
      !customer.expiry ||
      !customer.cvv
    ) {
      alert("Lütfen tüm ödeme bilgilerini doldurun!");
      return;
    }

    createOrder(cart, customer);
    clearCart();
    alert("Sipariş başarıyla oluşturuldu!");
  };

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sepet</h1>

      {cart.length === 0 ? (
        <p>Sepet boş.</p>
      ) : (
        <>
          {/* Ürünler */}
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}

                  <div>
                    <h2 className="font-semibold">{item.name}</h2>
                    <p>
                      {item.price} TL x {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    -
                  </button>

                  <span className="px-2 font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => addToCart(item)}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Toplam */}
          <h2 className="text-xl font-bold mb-6">
            Toplam: {total} TL
          </h2>

          {/* Ödeme Formu */}
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold">Ödeme Bilgileri</h2>

            <input
              placeholder="İsim"
              className="w-full border p-2 rounded"
              value={customer.firstName}
              onChange={(e) =>
                setCustomer({ ...customer, firstName: e.target.value })
              }
            />

            <input
              placeholder="Soyisim"
              className="w-full border p-2 rounded"
              value={customer.lastName}
              onChange={(e) =>
                setCustomer({ ...customer, lastName: e.target.value })
              }
            />

            <input
              placeholder="Telefon"
              className="w-full border p-2 rounded"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />

            <input
              placeholder="Kart Numarası"
              className="w-full border p-2 rounded"
              value={customer.cardNumber}
              onChange={(e) =>
                setCustomer({ ...customer, cardNumber: e.target.value })
              }
            />

            <input
              placeholder="Son Kullanma (MM/YY)"
              className="w-full border p-2 rounded"
              value={customer.expiry}
              onChange={(e) =>
                setCustomer({ ...customer, expiry: e.target.value })
              }
            />

            <input
              placeholder="CVV"
              className="w-full border p-2 rounded"
              value={customer.cvv}
              onChange={(e) =>
                setCustomer({ ...customer, cvv: e.target.value })
              }
            />

            <button
              onClick={handleOrder}
              className="bg-green-600 text-white px-6 py-2 rounded w-full"
            >
              Siparişi Tamamla
            </button>
          </div>
        </>
      )}
    </div>
  );
}
