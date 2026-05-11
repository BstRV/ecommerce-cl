import { formatPrice } from "@ecommerce-preset/types"
import type { Product } from "@ecommerce-preset/types"

interface ProductCardProps {
  product: Product
  /** 0-3 index to cycle through geometric placeholder variants */
  patternIndex?: number
}

/**
 * Server component — no "use client" needed.
 * Uses a CSS grid geometric pattern as image placeholder until real media lands.
 */
export function ProductCard({ product, patternIndex = 0 }: ProductCardProps) {
  const firstVariant = product.variants[0]
  const firstPrice = firstVariant?.prices[0]

  return (
    <article className="group relative flex flex-col">
      {/* Image area — geometric placeholder */}
      <a
        href={`/productos/${product.handle}`}
        className="block relative overflow-hidden bg-secondary aspect-[3/4]"
        tabIndex={-1}
        aria-hidden="true"
      >
        {product.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <GeometricPlaceholder index={patternIndex} />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-foreground/90 px-4 py-3 flex items-center justify-between">
          <span className="text-background text-sm font-medium tracking-wide">
            Ver Producto
          </span>
          <span className="text-background text-sm" aria-hidden="true">
            →
          </span>
        </div>
      </a>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-0.5">
        <a
          href={`/productos/${product.handle}`}
          className="text-sm font-medium text-foreground hover:underline underline-offset-2 line-clamp-1"
        >
          {product.title}
        </a>
        {product.subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {product.subtitle}
          </p>
        )}
        {firstPrice && (
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatPrice(firstPrice.amount, firstPrice.currencyCode)}
          </p>
        )}
      </div>
    </article>
  )
}

/**
 * CSS-only geometric placeholder with 4 variants (index 0-3).
 * Each uses a different background motif so the grid looks varied.
 */
function GeometricPlaceholder({ index = 0 }: { index?: number }) {
  const variant = index % 4

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* Shared grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgb(var(--brand-border)) 1px, transparent 1px),
            linear-gradient(90deg, rgb(var(--brand-border)) 1px, transparent 1px)
          `,
          backgroundSize: variant % 2 === 0 ? "40px 40px" : "32px 32px",
        }}
      />

      {/* Variant-specific motif */}
      <div className="relative">
        {variant === 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 border border-muted-foreground/30 rotate-45" />
            <div className="w-2 h-2 bg-muted-foreground/25" />
          </div>
        )}
        {variant === 1 && (
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border border-muted-foreground/25" />
            <div className="absolute inset-2 border border-muted-foreground/15" />
            <div className="absolute inset-4 bg-muted-foreground/10" />
          </div>
        )}
        {variant === 2 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-muted-foreground/20" />
            <div className="w-6 h-6 border border-muted-foreground/30 rotate-45" />
            <div className="w-3 h-3 bg-muted-foreground/20" />
          </div>
        )}
        {variant === 3 && (
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 border border-muted-foreground/20 rotate-12" />
            <div className="absolute inset-0 border border-muted-foreground/20 -rotate-12" />
            <div className="w-2 h-2 bg-muted-foreground/30" />
          </div>
        )}
      </div>
    </div>
  )
}
