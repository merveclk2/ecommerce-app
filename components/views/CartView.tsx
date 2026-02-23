"use client";

import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { OrderContext, CustomerInfo } from "@/context/OrderContext";

export default function CartView() {
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

  const [orderSuccess, setOrderSuccess] = useState(false);

  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    phone: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  /* ---------------- FORMAT FUNCTIONS ---------------- */

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 16);
    return numbers.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 4);
    if (numbers.length >= 3) {
      return numbers.slice(0, 2) + "/" + numbers.slice(2);
    }
    return numbers;
  };

  const formatCVV = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 3);
  };

  const formatPhone = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 11);
  };

  /* ---------------- TOTAL ---------------- */

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  /* ---------------- ORDER ---------------- */

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
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (customer.cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Kart numarası 16 haneli olmalıdır.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(customer.expiry)) {
      alert("Son kullanma tarihi MM/YY formatında olmalıdır.");
      return;
    }

    if (customer.cvv.length !== 3) {
      alert("CVV 3 haneli olmalıdır.");
      return;
    }

    createOrder(cart, customer);
    clearCart();
    setOrderSuccess(true);
  };

  /* ---------------- SUCCESS SCREEN ---------------- */

  if (orderSuccess) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow text-center">
          <h1 className="text-3xl font-bold text-green-600">
            Ödeme Başarıyla Alındı 🎉
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Siparişiniz oluşturuldu. Teşekkür ederiz.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div>
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
                className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>
                    {item.price} TL x {item.quantity}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    -
                  </button>

                  <span className="font-semibold">
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
          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-bold">Ödeme Bilgileri</h2>

            <input
              placeholder="Ad"
              className="w-full border p-2 rounded dark:bg-gray-700"
              value={customer.firstName}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  firstName: e.target.value.replace(
                    /[^a-zA-ZğüşöçıİĞÜŞÖÇ\s]/g,
                    ""
                  ),
                })
              }
            />

            <input
              placeholder="Soyad"
              className="w-full border p-2 rounded dark:bg-gray-700"
              value={customer.lastName}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  lastName: e.target.value.replace(
                    /[^a-zA-ZğüşöçıİĞÜŞÖÇ\s]/g,
                    ""
                  ),
                })
              }
            />

            <input
              placeholder="Telefon"
              className="w-full border p-2 rounded dark:bg-gray-700"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  phone: formatPhone(e.target.value),
                })
              }
            />

            <input
              placeholder="1234 5678 9012 3456"
              className="w-full border p-2 rounded tracking-widest dark:bg-gray-700"
              value={customer.cardNumber}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  cardNumber: formatCardNumber(e.target.value),
                })
              }
            />

            <div className="flex gap-4">
              <input
                placeholder="MM/YY"
                className="w-full border p-2 rounded dark:bg-gray-700"
                value={customer.expiry}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    expiry: formatExpiry(e.target.value),
                  })
                }
              />

              <input
                placeholder="CVV"
                className="w-full border p-2 rounded dark:bg-gray-700"
                value={customer.cvv}
                onChange={(e) =>
                  setCustomer({
                    ...customer,
                    cvv: formatCVV(e.target.value),
                  })
                }
              />
            </div>

            <button
              onClick={handleOrder}
              className="bg-green-600 text-white px-6 py-2 rounded w-full hover:bg-green-700 transition"
            >
              Siparişi Tamamla
            </button>
          </div>
        </>
      )}
    </div>
  );
}
