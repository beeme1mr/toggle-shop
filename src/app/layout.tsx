import "./globals.css";
import { Inter } from "next/font/google";
import { CartProvider } from "@/providers/cart";
import { ReactQueryProvider } from "@/providers/react-query";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ToggleShop",
  description: "If it can toggle, you'll find it here!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <CartProvider>{children}</CartProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
