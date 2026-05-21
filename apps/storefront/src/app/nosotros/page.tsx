import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { PageHeader } from "@/components/PageHeader"

export const metadata = { title: "Nosotros" }

const VALUES = [
  {
    number: "01",
    title: "Permanencia",
    text: "Diseñamos para que las prendas duren años, no temporadas. Cada corte, cada costura, apunta a la longevidad.",
  },
  {
    number: "02",
    title: "Selección",
    text: "Trabajamos únicamente con talleres y proveedores que comparten nuestro estándar de calidad.",
  },
  {
    number: "03",
    title: "Neutralidad",
    text: "Una paleta atemporal. Sin tendencias efímeras, sin colores que caducan. Solo formas y texturas que resisten el paso del tiempo.",
  },
  {
    number: "04",
    title: "Transparencia",
    text: "Precios justos, procesos honestos. Conoces qué hay detrás de cada prenda.",
  },
]

export default function NosotrosPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        title="Nosotros"
        breadcrumbs={[{ label: "Nosotros" }]}
      />

      <main>

        {/* Manifesto */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-[1fr_1.2fr] gap-16 items-start">
          <div className="animate-fade-up">
            {/* section-label de utilities.css */}
            <p className="section-label mb-6">Nuestra historia</p>
            <h2 className="font-display text-5xl lg:text-6xl text-foreground leading-tight">
              Nacemos del
              <br />
              rechazo a lo
              <br />
              desechable.
            </h2>
          </div>

          {/* stagger-section desde typography.css */}
          <div className="space-y-6 animate-fade-up delay-section">
            <p className="text-muted-foreground leading-relaxed">
              Preset nació en Santiago en 2022 con una premisa simple: la moda no debería
              ser ruidosa. Fundamos la marca como respuesta directa a la sobreproducción
              y al ciclo interminable de tendencias que convierte la ropa en basura antes
              de que pierda su forma.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nuestro equipo es pequeño y deliberado. Cada temporada editamos un número
              reducido de piezas, producidas en talleres locales con materiales
              seleccionados cuidadosamente. No perseguimos el volumen; perseguimos
              el estándar.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Si estás aquí es porque compartes esa mirada. Bienvenido.
            </p>
          </div>
        </section>

        {/* Geometric break */}
        <div className="relative overflow-hidden bg-background border-y border-border py-24 px-6" aria-hidden="true">
          {/* bg-grid de utilities.css */}
          <div className="bg-grid-break absolute inset-0" />
          <div className="relative max-w-7xl mx-auto flex items-center justify-center gap-8">
            <div className="w-px h-24 bg-foreground/20" />
            {/* var(--text-quote) desde typography.css */}
            <p className="font-display text-foreground text-center text-quote">
              &ldquo;La ropa más elegante es la que no necesita gritar.&rdquo;
            </p>
            <div className="w-px h-24 bg-foreground/20" />
          </div>
        </div>

        {/* Values grid */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          {/* section-label de utilities.css */}
          <p className="section-label mb-12">Nuestros valores</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((v, i) => (
              <div
                key={v.number}
                className="animate-fade-up delay-list"
                style={{ "--i": i } as React.CSSProperties}
              >
                <p className="font-display text-6xl text-muted-foreground/20 leading-none mb-4">
                  {v.number}
                </p>
                <h3 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-3">
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team / location */}
        <section className="bg-secondary px-6 py-24">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            {/* Geometric composition */}
            <div className="relative h-64 order-last md:order-first" aria-hidden="true">
              <div className="absolute inset-0 border border-border" />
              <div className="absolute inset-8 border border-muted-foreground/15" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-foreground rotate-45" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border border-muted-foreground/30" />
              <div className="absolute top-6 left-6 w-3 h-3 bg-muted-foreground/30" />
            </div>

            <div>
              {/* section-label de utilities.css */}
              <p className="section-label mb-4">Dónde estamos</p>
              <h2 className="font-display text-4xl text-foreground leading-tight mb-6">
                Santiago de Chile
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Nuestro estudio y showroom se encuentran en Providencia. Si quieres
                conocer la colección en persona, escríbenos para coordinar una visita.
              </p>
              {/* link-underline de utilities.css */}
              <a href="mailto:hola@preset.cl" className="link-underline">
                hola@preset.cl →
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="font-display text-4xl text-foreground mb-6">
            ¿Listo para explorar?
          </h2>
          {/* btn-primary de utilities.css */}
          <a href="/colecciones" className="btn-primary">
            Ver colecciones
            <span aria-hidden="true">→</span>
          </a>
        </section>

      </main>

      <Footer />
    </>
  )
}
