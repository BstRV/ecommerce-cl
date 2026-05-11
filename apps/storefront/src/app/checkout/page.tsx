'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-store'

type Step = 'envio' | 'resumen'

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>('envio')
  const { items, subtotal } = useCart()

  const shippingCost = subtotal >= 49990 ? 0 : 3990
  const total = subtotal + shippingCost

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

              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => { e.preventDefault(); setStep('resumen') }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nombre" className="text-sm font-medium">Nombre</label>
                    <input id="nombre" name="nombre" type="text" required placeholder="María"
                      className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="apellido" className="text-sm font-medium">Apellido</label>
                    <input id="apellido" name="apellido" type="text" required placeholder="González"
                      className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-medium">Correo electrónico</label>
                  <input id="email" name="email" type="email" required placeholder="maria@correo.cl"
                    className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="telefono" className="text-sm font-medium">Teléfono</label>
                  <input id="telefono" name="telefono" type="tel" placeholder="+56 9 1234 5678"
                    className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="direccion" className="text-sm font-medium">Dirección</label>
                  <input id="direccion" name="direccion" type="text" required placeholder="Av. Providencia 1234, Depto 5"
                    className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="ciudad" className="text-sm font-medium">Ciudad</label>
                    <input id="ciudad" name="ciudad" type="text" required placeholder="Santiago"
                      className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring placeholder:text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="region" className="text-sm font-medium">Región</label>
                    <select id="region" name="region" required
                      className="px-3 py-2.5 text-sm border border-input bg-background rounded-[var(--brand-radius)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground">
                      <option value="">Seleccionar</option>
                      <option>Región Metropolitana</option>
                      <option>Valparaíso</option>
                      <option>Biobío</option>
                      <option>La Araucanía</option>
                      <option>Los Lagos</option>
                      <option>O&apos;Higgins</option>
                      <option>Maule</option>
                      <option>Antofagasta</option>
                      <option>Tarapacá</option>
                      <option>Atacama</option>
                      <option>Coquimbo</option>
                      <option>Los Ríos</option>
                      <option>Arica y Parinacota</option>
                      <option>Aysén</option>
                      <option>Magallanes</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-[var(--brand-radius)]"
                >
                  Continuar al resumen
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
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 py-4 border-b border-border">
                    <div className="w-16 h-20 bg-muted rounded-[var(--brand-radius)] flex-shrink-0" />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{item.title}</p>
                      {item.variantTitle && (
                        <p className="text-muted-foreground mt-0.5">{item.variantTitle}</p>
                      )}
                      <p className="text-muted-foreground mt-0.5">Cant. {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium tabular-nums">
                      ${(item.price * item.quantity).toLocaleString('es-CL')}
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

          {subtotal < 49990 && (
            <p className="text-xs text-muted-foreground mt-4">
              Agrega ${(49990 - subtotal).toLocaleString('es-CL')} más para envío gratis.
            </p>
          )}
        </aside>
      </div>
    </main>
  )
}
