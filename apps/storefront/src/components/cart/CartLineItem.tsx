"use client"

import { useCart } from "@/lib/cart-store"
import type { LocalCartItem } from "@/lib/cart-store"
import { formatPrice } from "@ecommerce-preset/types"

interface CartLineItemProps {
  item: LocalCartItem
}

export function CartLineItem({ item }: CartLineItemProps) {
  const { removeItem, updateQuantity } = useCart()
  const price = item.variant.prices[0]
  const lineTotal = price ? price.amount * item.quantity : 0

  return (
    <div className="flex gap-4 py-6 border-b border-border animate-fade-in">
      {/* Thumbnail / placeholder */}
      <div className="w-20 h-24 shrink-0 bg-secondary overflow-hidden relative">
        {item.product.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.product.thumbnail}
            alt={item.product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage: `
                linear-gradient(rgb(var(--brand-border)) 1px, transparent 1px),
                linear-gradient(90deg, rgb(var(--brand-border)) 1px, transparent 1px)
              `,
              backgroundSize: "16px 16px",
            }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
            {item.product.title}
          </p>
          {item.variant.title !== "Default" && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.variant.title}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 mt-3">
          {/* Qty control */}
          <div className="flex items-center border border-border">
            <button
              type="button"
              onClick={() =>
                item.quantity > 1
                  ? updateQuantity(item.variantId, item.quantity - 1)
                  : removeItem(item.variantId)
              }
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span
              className="w-8 text-center text-sm text-foreground"
              aria-live="polite"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              disabled={item.quantity >= (item.variant.inventoryQuantity ?? 99)}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          {/* Line total */}
          {price && (
            <p className="text-sm font-semibold text-foreground">
              {formatPrice(lineTotal, price.currencyCode)}
            </p>
          )}
        </div>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => removeItem(item.variantId)}
        className="self-start text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1"
        aria-label={`Eliminar ${item.product.title}`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
