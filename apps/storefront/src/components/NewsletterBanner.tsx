export function NewsletterBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="border border-border p-10 md:p-16 flex flex-col md:flex-row md:items-center gap-10 justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Acceso anticipado
          </p>
          <h2 className="font-display text-3xl text-foreground">
            Sé el primero en saberlo
          </h2>
          <p className="mt-3 text-muted-foreground text-sm max-w-xs leading-relaxed">
            Lanzamientos, ventas privadas y colecciones exclusivas — directo a
            tu correo antes que nadie.
          </p>
        </div>

        <form
          action="/api/newsletter"
          method="post"
          className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="tu@email.com"
            className="flex-1 min-w-0 md:w-64 border border-input bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            type="submit"
            className="bg-foreground text-background px-7 py-3 text-sm font-medium tracking-wide hover:bg-foreground/85 transition-colors whitespace-nowrap"
          >
            Suscribirse
          </button>
        </form>
      </div>
    </section>
  )
}
