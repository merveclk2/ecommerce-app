import "./globals.css";

import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "MyShop",
  description: "Modern E-Commerce App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-gray-100">
        <AuthProvider>
          <ThemeProvider>
            <ProductProvider>
              <CartProvider>
                <OrderProvider>
                  {children}
                </OrderProvider>
              </CartProvider>
            </ProductProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
