'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { PageHeader } from '@/components/PageHeader'
import { submitContactForm } from './actions'
import { Footer } from '@/components/Footer'

// Note: metadata export moved to layout since this is now a client component
// export const metadata: Metadata = {
//   title: 'Contacto | Preset',
//   description: 'Ponte en contacto con nosotros.',
// }

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = await submitContactForm(formData)

    if (result.success) {
      setSubmitted(true)
      setFormData({ nombre: '', email: '', mensaje: '' })
      // Reset submitted state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000)
    } else {
      setError(result.error)
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <PageHeader
          title="Contacto"
          subtitle="Estamos aquí para ayudarte."
          breadcrumbs={[{ label: "Contacto" }]}
        />

        <div className="max-w-2xl mx-auto px-6 pb-24 mt-10">
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nombre" className="form-label">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Tu nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                disabled={isSubmitting}
                className="form-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="tu@correo.cl"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="form-input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="mensaje" className="form-label">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={5}
                placeholder="¿En qué podemos ayudarte?"
                required
                value={formData.mensaje}
                onChange={handleChange}
                disabled={isSubmitting}
                className="form-input resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-[var(--brand-radius)] text-sm text-destructive">
                {error}
              </div>
            )}

            {submitted && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-[var(--brand-radius)] text-sm text-green-800">
                Gracias por tu mensaje. Nos pondremos en contacto pronto.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className="btn-primary w-full"
            >
              {isSubmitting ? 'Enviando...' : submitted ? 'Mensaje enviado' : 'Enviar mensaje'}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Respondemos en un plazo de 24 horas hábiles.
            </p>
          </form>
        </div>
      </div>
    </main>

    <Footer />
  </>
)
}
