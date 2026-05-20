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
      {/*
        ─── Theme bootstrap script ───────────────────────────────────────────────
        Este script se ejecuta de forma SINCRÓNICA antes de que React hidrate y
        antes de que se pinten los estilos, eliminando el FOUC (Flash of Unstyled
        Content) del tema en TODAS las páginas de la app.

        Lógica: lee localStorage → si no hay preferencia guardada, usa la
        preferencia del sistema operativo (prefers-color-scheme). Aplica o quita
        la clase "dark" directamente en <html> para que los tokens CSS ya estén
        correctos desde el primer frame pintado.

        "dangerouslySetInnerHTML" es la única forma de inyectar scripts inline en
        el App Router de Next.js sin que el bundler lo procese.
      */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = stored === 'dark' || (!stored && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Si localStorage no está disponible (modo privado estricto, etc.)
                  // no hacemos nada y el tema claro queda como defecto.
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
