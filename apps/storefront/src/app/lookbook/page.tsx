import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { PageHeader } from "@/components/PageHeader"

export const metadata = { title: "Lookbook" }

const LOOKS = [
  {
    id: 1,
    title: "Minimalismo Urbano",
    description: "Líneas limpias y proporciones precisas para el día a día en la ciudad.",
    products: ["Abrigo Estructura", "Pantalón Recto", "Camiseta Base"],
  },
  {
    id: 2,
    title: "Capas Atemporales",
    description: "La versatilidad de superponer texturas y siluetas sin perder la elegancia.",
    products: ["Blazer Oversize", "Jersey Cuello Alto", "Falda Midi"],
  },
  {
    id: 3,
    title: "Negro Absoluto",
    description: "Una exploración del negro en todas sus dimensiones: mate, brillo, textura.",
    products: ["Vestido Columna", "Botín Cuero", "Bolso Geométrico"],
  },
  {
    id: 4,
    title: "Esenciales de Entretiempo",
    description: "Piezas de transición que funcionan de marzo a noviembre sin esfuerzo.",
    products: ["Trench Ligero", "Camisa Oxford", "Denim Selvedge"],
  },
]

export default function LookbookPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="Lookbook"
        subtitle="Colección 2025 — Formas que permanecen."
        breadcrumbs={[{ label: "Lookbook" }]}
      />

      <main>
        {/* Intro editorial */}
        <section className="max-w-3xl mx-auto px-6 pb-16 text-center">
          <p className="text-muted-foreground text-base leading-relaxed">
            Cada temporada editamos un número reducido de looks. No seguimos tendencias;
            proponemos un vocabulario visual que trasciende estaciones. Estas son las
            combinaciones que definen la colección actual.
          </p>
        </section>

        {/* Looks grid */}
        {LOOKS.map((look, i) => (
          <section
            key={look.id}
            className={`px-6 py-20 ${i % 2 === 0 ? "bg-background" : "bg-secondary"}`}
          >
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              {/* Visual composition placeholder */}
              <div
                className={`relative aspect-[3/4] overflow-hidden ${
                  i % 2 !== 0 ? "md:order-last" : ""
                }`}
              >
                {/* Geometric art composition */}
                <div className="absolute inset-0 border border-border" />
                <div className="bg-grid-break absolute inset-0" aria-hidden="true" />

                {/* Decorative elements unique per card */}
                <div className="absolute inset-12 border border-muted-foreground/10" />
                <div
                  className="lookbook-motif-rotated"
                  style={{ "--i": i } as React.CSSProperties}
                />
                <div
                  className="lookbook-motif-square"
                  style={{ "--i": i } as React.CSSProperties}
                />
                <div
                  className="lookbook-motif-dot"
                  style={{ "--i": i } as React.CSSProperties}
                />

                {/* Look number overlay */}
                <div className="absolute bottom-6 left-6">
                  <span className="font-display text-6xl text-foreground/10">
                    {String(look.id).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div
                className="animate-fade-up delay-list"
                style={{ "--i": i } as React.CSSProperties}
              >
                <p className="section-label mb-4">
                  Look {String(look.id).padStart(2, "0")}
                </p>
                <h2 className="font-display text-4xl lg:text-5xl text-foreground leading-tight mb-6">
                  {look.title}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
                  {look.description}
                </p>

                {/* Products in this look */}
                <div className="space-y-3 mb-10">
                  <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                    Prendas del look
                  </p>
                  {look.products.map((product) => (
                    <div
                      key={product}
                      className="flex items-center justify-between py-2.5 border-b border-border text-sm"
                    >
                      <span className="text-foreground">{product}</span>
                      <a
                        href="/colecciones"
                        className="text-muted-foreground hover:text-foreground transition-colors transition-duration-base"
                      >
                        Ver →
                      </a>
                    </div>
                  ))}
                </div>

                <a href="/colecciones" className="btn-primary">
                  Comprar este look
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <p className="section-label mb-4">¿Te identificas con nuestra visión?</p>
          <h2 className="font-display text-4xl text-foreground mb-8">
            Explora la colección completa
          </h2>
          <a href="/colecciones" className="btn-primary btn-primary-lg">
            Ver todas las prendas
            <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>

      <Footer />
    </>
  )
}
