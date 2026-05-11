'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { useCart } from '@/lib/cart-store'
import { SHIPPING_CONFIG } from '@/lib/constants'

type Step = 'envio' | 'resumen'

interface ShippingFormData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  region: string
}

// Zod schema para validación robusta de formulario
const checkoutFormSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido').trim(),
  apellido: z.string().min(1, 'Apellido requerido').trim(),
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  telefono: z.string().min(1, 'Teléfono requerido').trim(),
  direccion: z.string().min(1, 'Dirección requerida').trim(),
  ciudad: z.string().min(1, 'Ciudad requerida').trim(),
  region: z.string().min(1, 'Región requerida'),
})

const initialFormData = (): ShippingFormData => {
  // Cargar datos guardados del localStorage con validación Zod
  if (typeof window === 'undefined') {
    return {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      region: '',
    }
  }

  const saved = localStorage.getItem('checkout_form_data')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      // Validar que los datos cargados cumplan con el schema
      const validated = checkoutFormSchema.safeParse(parsed)
      if (validated.success) {
        return validated.data
      }
    } catch {
      // Si hay error al parsear, ignorar
    }
  }

  return {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
  }
}

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('envio')
  const [formData, setFormData] = useState<ShippingFormData>(initialFormData())
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { items, subtotal } = useCart()

  // Guardar datos al cambiar
  useEffect(() => {
    localStorage.setItem('checkout_form_data', JSON.stringify(formData))
  }, [formData])

  const shippingCost = subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CONFIG.STANDARD_SHIPPING_COST
  const total = subtotal + shippingCost

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    // Usar Zod para validación robusta
    const validation = checkoutFormSchema.safeParse(formData)

    if (!validation.success) {
      // Extraer errores del schema
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof ShippingFormData
        newErrors[fieldName] = issue.message
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error para este campo
    if (errors[name as keyof ShippingFormData]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof ShippingFormData]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 500))
      setStep('resumen')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-2xl mb-4">Tu carrito está vacío</p>
        <Link
          href="/colecciones"
          className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-[var(--brand-radius)] hover:opacity-90 transition-opacity"
        >
          Ver colecciones
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Indicador de pasos */}
      <div className="flex items-center gap-3 mb-10">
        <Link href="/carrito" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Carrito
        </Link>
        <span className="text-border text-xs">›</span>
        <span className={`text-sm font-medium ${step === 'envio' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Envío
        </span>
        <span className="text-border text-xs">›</span>
        <span className={`text-sm font-medium ${step === 'resumen' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Resumen y pago
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        {/* Panel izquierdo */}
        <div>
          {step === 'envio' && (
            <section>
              <h1 className="font-display text-2xl mb-6 tracking-tight">Dirección de envío</h1>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nombre" className="text-sm font-medium">Nombre</label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      placeholder="María"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`px-3 py-2.5 text-sm border rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground bg-background ${
                        errors.nombre ? 'border-destructive' : 'border-input'
                      }`}
                    />
                    {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="apellido" className="text-sm font-medium">Apellido</label>
                    <input
                      id="apellido"
                      name="apellido"
                      type="text"
                      placeholder="González"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className={`px-3 py-2.5 text-sm border rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground bg-background ${
                        errors.apellido ? 'border-destructive' : 'border-input'
                      }`}
                    />
                    {errors.apellido && <p className="text-xs text-destructive">{errors.apellido}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">Correo electrónico</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="maria@correo.cl"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`px-3 py-2.5 text-sm border rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground bg-background ${
                      errors.email ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="telefono" className="text-sm font-medium">Teléfono</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className={`px-3 py-2.5 text-sm border rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground bg-background ${
                      errors.telefono ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="direccion" className="text-sm font-medium">Dirección</label>
                  <input
                    id="direccion"
                    name="direccion"
                    type="text"
                    placeholder="Av. Providencia 1234, Depto 5"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    className={`px-3 py-2.5 text-sm border rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground bg-background ${
                      errors.direccion ? 'border-destructive' : 'border-input'
                    }`}
                  />
                  {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ciudad" className="text-sm font-medium">Ciudad</label>
                    <input
                      id="ciudad"
                      name="ciudad"
                      type="text"
                      placeholder="Santiago"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      className={`px-3 py-2.5 text-sm border rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground bg-background ${
                        errors.ciudad ? 'border-destructive' : 'border-input'
                      }`}
                    />
                    {errors.ciudad && <p className="text-xs text-destructive">{errors.ciudad}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="region" className="text-sm font-medium">Región</label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className={`px-3 py-2.5 text-sm border rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground bg-background ${
                        errors.region ? 'border-destructive' : 'border-input'
                      }`}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Región Metropolitana">Región Metropolitana</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="Biobío">Biobío</option>
                      <option value="La Araucanía">La Araucanía</option>
                      <option value="Los Lagos">Los Lagos</option>
                      <option value="O'Higgins">O&apos;Higgins</option>
                      <option value="Maule">Maule</option>
                      <option value="Antofagasta">Antofagasta</option>
                      <option value="Tarapacá">Tarapacá</option>
                      <option value="Atacama">Atacama</option>
                      <option value="Coquimbo">Coquimbo</option>
                      <option value="Los Ríos">Los Ríos</option>
                      <option value="Arica y Parinacota">Arica y Parinacota</option>
                      <option value="Aysén">Aysén</option>
                      <option value="Magallanes">Magallanes</option>
                    </select>
                    {errors.region && <p className="text-xs text-destructive">{errors.region}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 mt-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity rounded-[var(--brand-radius)]"
                >
                  {isSubmitting ? 'Procesando...' : 'Continuar al resumen'}
                </button>
              </form>
            </section>
          )}

          {step === 'resumen' && (
            <section>
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setStep('envio')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  ← Editar envío
                </button>
                <h1 className="font-display text-2xl tracking-tight">Resumen del pedido</h1>
              </div>

              {/* Lista de items */}
              <div className="flex flex-col gap-4 mb-8">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-4 py-4 border-b border-border">
                    <div className="w-16 h-20 bg-muted rounded-[var(--brand-radius)] flex-shrink-0" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{item.product.title}</p>
                      {item.variant.title && (
                        <p className="text-muted-foreground mt-0.5">{item.variant.title}</p>
                      )}
                      <p className="text-muted-foreground mt-0.5">Cant. {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium tabular-nums">
                      ${((item.variant.prices?.[0]?.amount ?? 0) * item.quantity).toLocaleString('es-CL')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Placeholder de pago — Fase 2 (Mercado Pago) */}
              <div className="p-4 border border-dashed border-border rounded-[var(--brand-radius)] text-center text-sm text-muted-foreground">
                El módulo de pago (Mercado Pago) se integrará en la Fase 2.
              </div>
            </section>
          )}
        </div>

        {/* Panel derecho — resumen de costos */}
        <aside className="bg-secondary rounded-[var(--brand-radius)] p-6 h-fit">
          <h2 className="font-medium text-sm mb-4 tracking-tight">Resumen</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-CL')}`}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between font-medium text-base">
              <span>Total</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </div>
          </div>

          {subtotal < SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD && (
            <p className="text-xs text-muted-foreground mt-4">
              Agrega ${(SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('es-CL')} más para envío gratis.
            </p>
          )}
        </aside>
      </div>
    </main>
  )
}
