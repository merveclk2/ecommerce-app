import "./globals.css";
import Providers from "./Providers";
import ThemeToggle from "@/components/ThemeToggle";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FloatingActions from "@/components/FloatingActions";

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
      <body className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        <LanguageProvider>
          <Providers>
            <div className="fixed top-6 right-6 z-50 flex gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            {/* 🔥 SONNER GLOBAL */}
            <Toaster
              position="top-right"
              richColors
              closeButton
              expand={true}
            />

            {children}
            <FloatingActions />

          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}