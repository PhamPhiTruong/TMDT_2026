import type { Metadata } from "next";
import { Roboto, Geist_Mono, Geist } from "next/font/google";
import "../styles/globals.css";
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/QueryProviders";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nonglam Store",
  description: "Cửa hàng nông sản sấy - Nonglam Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={cn("h-full", "antialiased", roboto.variable, geistMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryProvider>
      </body>
    </html>
  );
}
