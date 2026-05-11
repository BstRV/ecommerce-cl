import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display } from "next/font/google";
import { CartProvider } from "@/lib/cart-store";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    template: "%s — Preset",
    default: "Tienda Online — Preset",
  },
  description: "Tu destino de moda y estilo en Chile. Colecciones atemporales de calidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
