import { Navbar } from "@/components/Navbar"
import { ProductGrid } from "@/components/ProductGrid"
import { Footer } from "@/components/Footer"
import { NewsletterBanner } from "@/components/NewsletterBanner"
import { medusa } from "@/lib/medusa"

export default async function Home() {
  const products = await medusa.getProducts()
  const featured = products.slice(0, 8)

  return (
    <>
      <Navbar />

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative min-h-svh flex flex-col justify-end pb-20 px-6 overflow-hidden bg-background">
          {/* Subtle grid overlay — usa bg-grid de utilities.css, tamaño desde typography.css */}
          <div className="bg-grid-hero absolute inset-0" aria-hidden="true" />

          {/* Decorative diagonal line */}
          <div
            className="absolute top-0 right-0 w-px h-full bg-foreground/10 -rotate-12 translate-x-40 origin-top"
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto w-full">
            {/* section-label de utilities.css */}
            <p className="section-label text-foreground/40 mb-6">
              Colección 2025
            </p>

            {/* Tamaño fluido desde typography.css */}
            <h1 className="font-display text-foreground leading-none tracking-tight text-hero">
              Nueva
              <br />
              Temporada
            </h1>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              {/* btn-primary de utilities.css */}
              <a href="/colecciones" className="btn-primary">
                Explorar Colección
                <span aria-hidden="true">→</span>
              </a>
              {/* btn-ghost de utilities.css */}
              <a href="/novedades" className="btn-ghost text-sm">
                Ver Novedades
              </a>
            </div>
          </div>
        </section>

        {/* ── Trust Bar ── */}
        <section className="border-y border-border bg-background">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "📦", text: "Envío gratis sobre $50.000" },
              { icon: "↩️", text: "Devoluciones gratuitas 30 días" },
              { icon: "🔒", text: "Pago 100% seguro" },
              { icon: "💬", text: "Atención personalizada" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg" aria-hidden="true">{item.icon}</span>
                <span className="text-xs text-muted-foreground tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Categorías Destacadas ── */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <p className="section-label mb-8">Explorar por categoría</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Mujer", href: "/colecciones?category=mujer" },
              { name: "Hombre", href: "/colecciones?category=hombre" },
              { name: "Accesorios", href: "/colecciones?category=accesorios" },
              { name: "Esenciales", href: "/colecciones?category=esenciales" },
            ].map((cat, i) => (
              <a
                key={cat.name}
                href={cat.href}
                className="group relative aspect-[4/5] border border-border overflow-hidden bg-secondary/30 flex flex-col justify-end p-6 animate-fade-up hover:border-foreground/30 transition-colors delay-list transition-duration-base"
                style={{ "--i": i } as React.CSSProperties}
              >
                {/* Geometric placeholder */}
                <div className="bg-grid-category absolute inset-0" aria-hidden="true" />
                <div
                  className="motif-rotated"
                  aria-hidden="true"
                  style={{ "--i": i } as React.CSSProperties}
                />
                <div
                  className="motif-square"
                  aria-hidden="true"
                  style={{ "--i": i } as React.CSSProperties}
                />

                {/* Category label */}
                <div className="relative">
                  <span className="font-display text-2xl text-foreground group-hover:translate-x-1 transition-transform transition-duration-base">
                    {cat.name}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1 group-hover:text-foreground transition-colors transition-duration-base">
                    Ver colección →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Featured products ── */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <ProductGrid
            products={featured}
            title="Destacados"
            viewAllHref="/colecciones"
          />
        </section>

        {/* ── Editorial banner ── */}
        <section className="bg-secondary py-24 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              {/* section-label de utilities.css */}
              <p className="section-label mb-4">Filosofía de marca</p>
              <h2 className="font-display text-5xl text-foreground leading-tight">
                Diseño sin
                <br />
                concesiones
              </h2>
              <p className="mt-6 text-muted-foreground text-base leading-relaxed max-w-sm">
                Cada pieza está pensada para durar. Materiales selectos,
                cortes exactos y una paleta atemporal que no sigue tendencias —
                las define.
              </p>
              {/* link-underline de utilities.css */}
              <a href="/nosotros" className="mt-8 link-underline">
                Conoce nuestra historia →
              </a>
            </div>

            <div className="relative h-72 md:h-auto" aria-hidden="true">
              <div className="absolute inset-4 border border-border" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-foreground/5 rotate-45" />
              </div>
              <div className="absolute bottom-8 right-8 w-16 h-16 border border-muted-foreground/20" />
              <div className="absolute top-8 left-8 w-6 h-6 bg-foreground" />
            </div>
          </div>
        </section>

        {/* ── Newsletter ── */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <NewsletterBanner />
        </section>

      </main>

      <Footer />
    </>
  )
}
