import { notFound } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Breadcrumb } from "@/components/Breadcrumb"
import { ProductGrid } from "@/components/ProductGrid"
import { AddToCartButton } from "@/components/cart/AddToCartButton"
import { getProductByHandle, getRelatedProducts } from "@/lib/mock-data"
import { formatPrice } from "@ecommerce-preset/types"

interface ProductPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params
  const product = getProductByHandle(handle)
  return { title: product?.title ?? "Producto" }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params
  const product = getProductByHandle(handle)
  if (!product) notFound()

  const related = getRelatedProducts(handle)
  const firstVariant = product.variants[0]
  const price = firstVariant?.prices[0]
  const category = product.categories[0]

  return (
    <>
      <Navbar />

      <main>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-4">
          <Breadcrumb
            items={[
              ...(category ? [{ label: "Colecciones", href: "/colecciones" }, { label: category.name, href: `/colecciones?categoria=${category.handle}` }] : [{ label: "Colecciones", href: "/colecciones" }]),
              { label: product.title },
            ]}
          />
        </div>

        {/* Product layout */}
        <section className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: image */}
          <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
            {product.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.thumbnail}
                alt={product.title}
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
                  backgroundSize: "40px 40px",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border border-muted-foreground/20 rotate-45" />
                </div>
              </div>
            )}
          </div>

          {/* Right: info + purchase */}
          <div className="flex flex-col gap-6 md:pt-4 animate-fade-up">
            {product.subtitle && (
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
                {product.subtitle}
              </p>
            )}

            <h1 className="font-display text-4xl lg:text-5xl text-foreground leading-tight">
              {product.title}
            </h1>

            {price && (
              <p className="text-2xl font-semibold text-foreground">
                {formatPrice(price.amount, price.currencyCode)}
              </p>
            )}

            {/* Variants / sizes */}
            {product.variants.length > 1 && (
              <div>
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                  Talla
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <label key={variant.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="variant"
                        value={variant.id}
                        defaultChecked={variant === firstVariant}
                        className="sr-only peer"
                      />
                      <span className="inline-flex items-center justify-center px-4 py-2 text-xs border border-border text-muted-foreground peer-checked:border-foreground peer-checked:text-foreground transition-colors hover:border-foreground hover:text-foreground">
                        {variant.options["size"] ?? variant.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            {firstVariant && (
              <AddToCartButton product={product} variant={firstVariant} />
            )}

            {/* Description */}
            {product.description && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Details accordion stub */}
            <div className="border-t border-border pt-4 space-y-3">
              {[
                ["Envíos", "Despacho a todo Chile en 3-5 días hábiles."],
                ["Devoluciones", "30 días para cambios y devoluciones."],
                ["Cuidado", "Ver etiqueta interior del producto."],
              ].map(([title, text]) => (
                <details key={title} className="group">
                  <summary className="flex items-center justify-between text-xs tracking-widest uppercase text-foreground cursor-pointer py-2 list-none">
                    {title}
                    <span className="text-muted-foreground group-open:rotate-45 transition-transform duration-200 select-none" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="text-sm text-muted-foreground leading-relaxed pb-2">
                    {text}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border mt-12">
            <ProductGrid
              products={related}
              title="También te puede interesar"
              columns={4}
            />
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
