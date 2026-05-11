const FOOTER_COLS = [
  {
    title: "Tienda",
    links: [
      { label: "Colecciones", href: "/colecciones" },
      { label: "Novedades", href: "/colecciones?sort=new" },
      { label: "Ofertas", href: "/colecciones?sort=price-asc" },
      { label: "Lookbook", href: "/lookbook" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { label: "Envíos", href: "/ayuda/envios" },
      { label: "Devoluciones", href: "/ayuda/devoluciones" },
      { label: "Tallas", href: "/ayuda/tallas" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", href: "/nosotros" },
      { label: "Prensa", href: "/prensa" },
      { label: "Sustentabilidad", href: "/sustentabilidad" },
      { label: "Trabaja con nosotros", href: "/careers" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <a href="/" className="flex items-center gap-2 mb-5" aria-label="Inicio">
            <span className="block w-4 h-4 bg-foreground" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-widest uppercase">
              Preset
            </span>
          </a>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Moda atemporal.
            <br />
            Santiago, Chile.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Lun – Vie · 9:00 – 18:00
          </p>
        </div>

        {/* Nav columns */}
        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <p className="text-xs tracking-[0.2em] uppercase text-foreground font-medium mb-5">
              {col.title}
            </p>
            <ul className="space-y-3 list-none p-0 m-0">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Ecommerce Preset. Todos los derechos reservados.</p>
          <div className="flex gap-5">
            <a href="/privacidad" className="hover:text-foreground transition-colors">
              Privacidad
            </a>
            <a href="/terminos" className="hover:text-foreground transition-colors">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
