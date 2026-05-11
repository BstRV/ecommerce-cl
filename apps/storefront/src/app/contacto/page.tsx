import PageHeader from '@/components/PageHeader'

export const metadata = {
  title: 'Contacto | Preset',
  description: 'Ponte en contacto con nosotros.',
}

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        title="Contacto"
        subtitle="Estamos aquí para ayudarte."
        breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: 'Contacto' }]}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
          {/* Info de contacto */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-medium mb-1 tracking-tight uppercase text-muted-foreground">
                Correo
              </h2>
              <a
                href="mailto:hola@preset.cl"
                className="text-base underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                hola@preset.cl
              </a>
            </div>
            <div>
              <h2 className="text-sm font-medium mb-1 tracking-tight uppercase text-muted-foreground">
                Horario de atención
              </h2>
              <p className="text-base text-foreground">
                Lunes a Viernes, 9:00 – 18:00
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium mb-1 tracking-tight uppercase text-muted-foreground">
                Ubicación
              </h2>
              <p className="text-base text-foreground">
                Santiago, Chile
              </p>
            </div>
          </div>

          {/* Formulario */}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nombre" className="text-sm font-medium">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                placeholder="Tu nombre"
                className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@correo.cl"
                className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="mensaje" className="text-sm font-medium">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                required
                rows={5}
                placeholder="¿En qué podemos ayudarte?"
                className="w-full px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-[var(--brand-radius)]"
            >
              Enviar mensaje
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Respondemos en un plazo de 24 horas hábiles.
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
