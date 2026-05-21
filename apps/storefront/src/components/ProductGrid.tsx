import type { Product } from "@ecommerce-preset/types"
import { ProductCard } from "./ProductCard"

interface ProductGridProps {
  products: Product[]
  title?: string
  viewAllHref?: string
  /** Número de columnas en escritorio (default 4) */
  columns?: 3 | 4
}

export function ProductGrid({
  products,
  title,
  viewAllHref,
  columns = 4,
}: ProductGridProps) {
  const gridCols =
    columns === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"

  return (
    <section>
      {(title || viewAllHref) && (
        <div className="flex items-baseline justify-between mb-10">
          {title && (
            <h2 className="font-display text-4xl text-foreground">{title}</h2>
          )}
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver todo →
            </a>
          )}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-muted-foreground text-sm py-12 text-center">
          No hay productos disponibles.
        </p>
      ) : (
        <div className={`grid ${gridCols} gap-x-4 gap-y-10`}>
          {products.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-up delay-grid"
              style={{ "--i": i } as React.CSSProperties}
            >
              <ProductCard product={product} patternIndex={i % 4} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
