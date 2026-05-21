export function NewsletterBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="border border-border p-10 md:p-16 flex flex-col md:flex-row md:items-center gap-10 justify-between">
        <div>
          {/* section-label de utilities.css */}
          <p className="section-label mb-3">Acceso anticipado</p>
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
          {/* form-input de utilities.css */}
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="tu@email.com"
            className="form-input min-w-0 md:w-64"
          />
          {/* btn-primary de utilities.css */}
          <button type="submit" className="btn-primary whitespace-nowrap">
            Suscribirse
          </button>
        </form>
      </div>
    </section>
  )
}
