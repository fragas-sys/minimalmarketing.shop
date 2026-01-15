import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { DiscountProvider } from "@/contexts/DiscountContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { DiscountBanner } from "@/components/ui/DiscountBanner";

export const metadata: Metadata = {
  title: "Minimal Marketing - Materiais Digitais para Profissionais de Marketing",
  description: "Shopping de materiais digitais que facilitam a vida de quem trabalha na internet com marketing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">
        <AuthProvider>
          <DiscountProvider>
            <CartProvider>
              <DiscountBanner />
              {children}
            </CartProvider>
          </DiscountProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
