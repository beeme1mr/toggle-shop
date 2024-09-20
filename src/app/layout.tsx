import "./globals.css";
import { Inter } from "next/font/google";
import { CartProvider } from "@/providers/cart";
import { ReactQueryProvider } from "@/providers/react-query";
import { OpenFeatureProvider } from "@/providers/open-feature";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ToggleShop",
  description: "If it can toggle, you'll find it here!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <OpenFeatureProvider>
            <CartProvider>{children}</CartProvider>
          </OpenFeatureProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
