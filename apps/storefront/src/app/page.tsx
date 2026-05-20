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
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            aria-hidden="true"
            style={{
              backgroundImage: `
                linear-gradient(rgb(var(--brand-foreground)) 1px, transparent 1px),
                linear-gradient(90deg, rgb(var(--brand-foreground)) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Decorative diagonal line */}
          <div
            className="absolute top-0 right-0 w-px h-full bg-foreground/10 -rotate-12 translate-x-40 origin-top"
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto w-full">
            <p className="text-foreground/40 text-xs tracking-[0.3em] uppercase mb-6">
              Colección 2025
            </p>

            <h1
              className="font-display text-foreground leading-none tracking-tight"
              style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)" }}
            >
              Nueva
              <br />
              Temporada
            </h1>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="/colecciones"
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 text-sm font-medium tracking-wide hover:bg-primary/90 transition-colors"
              >
                Explorar Colección
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="/colecciones"
                className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground text-sm tracking-wide transition-colors"
              >
                Ver Novedades
              </a>
            </div>
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
              <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4">
                Filosofía de marca
              </p>
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
              <a
                href="/nosotros"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground border-b border-foreground pb-0.5 hover:border-muted-foreground hover:text-muted-foreground transition-colors"
              >
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
