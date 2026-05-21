"use client"

import Link from "next/link"
import { useCart, type LocalCartItem } from "@/lib/cart-store"
import { CartLineItem } from "@/components/cart/CartLineItem"
import { EmptyState } from "@/components/EmptyState"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { formatPrice } from "@ecommerce-preset/types"
import { SHIPPING_CONFIG } from "@/lib/constants"

export default function CartPage() {
  const { items, subtotal, clear } = useCart()

  const shipping = subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CONFIG.STANDARD_SHIPPING_COST
  const total = subtotal + shipping

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-24 min-h-[80vh]">
        <h1 className="font-display text-5xl text-foreground mb-12">Carrito</h1>

        {items.length === 0 ? (
          <EmptyState
            title="Tu carrito está vacío"
            description="Agrega productos para continuar con tu compra."
            action={{ label: "Explorar colecciones", href: "/colecciones" }}
          />
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">

            {/* Line items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs tracking-widest uppercase text-muted-foreground">
                  {items.length} {items.length === 1 ? "artículo" : "artículos"}
                </p>
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>

              {items.map((item: LocalCartItem) => (
                <CartLineItem key={item.variantId} item={item} />
              ))}
            </div>

            {/* Order summary */}
            <aside className="border border-border p-6 sticky top-24">
              <h2 className="font-display text-2xl text-foreground mb-6">
                Resumen
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, "CLP")}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Envío</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-foreground">Gratis</span>
                    ) : (
                      formatPrice(shipping, "CLP")
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Envío gratis en compras sobre {formatPrice(SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD, "CLP")}
                  </p>
                )}

                <div className="flex justify-between font-semibold text-foreground border-t border-border pt-3 mt-3">
                  <span>Total</span>
                  <span>{formatPrice(total, "CLP")}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full btn-primary text-center"
              >
                Continuar al pago
              </Link>

              <a
                href="/colecciones"
                className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Seguir comprando
              </a>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </>
  )
}
