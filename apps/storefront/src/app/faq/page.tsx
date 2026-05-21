"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { PageHeader } from "@/components/PageHeader"

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="Preguntas Frecuentes"
        subtitle="Respuestas rápidas a las dudas más comunes."
        breadcrumbs={[{ label: "Preguntas Frecuentes" }]}
      />
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <FAQSection
          title="Pedidos y Pagos"
          items={[
            {
              q: "¿Qué métodos de pago aceptan?",
              a: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), Mercado Pago y transferencia bancaria. Todos los pagos se procesan en pesos chilenos (CLP) con cifrado SSL.",
            },
            {
              q: "¿Puedo pagar en cuotas?",
              a: "Sí, a través de Mercado Pago puedes pagar en hasta 6 cuotas sin interés con tarjetas de crédito participantes.",
            },
            {
              q: "¿Cuándo se cobra mi pedido?",
              a: "El cargo se realiza al momento de confirmar la compra. Si el producto no está disponible, te notificaremos y reembolsaremos el monto completo.",
            },
            {
              q: "¿Emiten boleta electrónica?",
              a: "Sí, todos los pedidos generan automáticamente una boleta electrónica (DTE) válida ante el SII. La recibirás por correo electrónico y podrás descargarla desde tu cuenta.",
            },
          ]}
        />
        <FAQSection
          title="Envíos y Entregas"
          items={[
            {
              q: "¿Cuánto cuesta el envío?",
              a: "El envío estándar a Santiago tiene un costo de $3.990 CLP. Para compras sobre $50.000 CLP el envío es gratuito. Los envíos a regiones tienen un costo variable según destino.",
            },
            {
              q: "¿Cuánto demora la entrega?",
              a: "Santiago: 1-3 días hábiles. Regiones: 3-7 días hábiles. Recibirás un correo con el número de seguimiento apenas despachemos tu pedido.",
            },
            {
              q: "¿Hacen envíos internacionales?",
              a: "Por el momento solo realizamos envíos dentro de Chile. Estamos trabajando para habilitar envíos a Latinoamérica próximamente.",
            },
          ]}
        />
        <FAQSection
          title="Devoluciones y Cambios"
          items={[
            {
              q: "¿Cuál es la política de devoluciones?",
              a: "Tienes 30 días desde la recepción para solicitar una devolución. El producto debe estar sin uso, con etiquetas originales y en su empaque. El reembolso se procesa en 5-10 días hábiles.",
            },
            {
              q: "¿Puedo cambiar la talla?",
              a: "Sí, ofrecemos un cambio de talla gratuito dentro de los primeros 15 días. Contáctanos por correo o a través del formulario de contacto para coordinar el cambio.",
            },
            {
              q: "¿Quién paga el envío de devolución?",
              a: "Si la devolución es por defecto de fabricación, nosotros cubrimos el costo. Para cambios por preferencia personal, el costo de envío corre por cuenta del cliente.",
            },
          ]}
        />
        <FAQSection
          title="Cuenta y Privacidad"
          items={[
            {
              q: "¿Necesito crear una cuenta para comprar?",
              a: "No es obligatorio. Puedes comprar como invitado. Sin embargo, al crear una cuenta podrás revisar tu historial de compras, guardar direcciones de envío y acceder a ofertas exclusivas.",
            },
            {
              q: "¿Cómo protegen mis datos personales?",
              a: "Utilizamos cifrado SSL en todas las transacciones y no almacenamos datos de tarjetas. Tu información personal se maneja de acuerdo a nuestra política de privacidad y la legislación chilena vigente.",
            },
            {
              q: "¿Puedo eliminar mi cuenta?",
              a: "Sí, puedes solicitar la eliminación de tu cuenta y datos personales en cualquier momento escribiéndonos a hola@preset.cl. Procesamos la solicitud en un plazo máximo de 5 días hábiles.",
            },
          ]}
        />
        <FAQSection
          title="Productos y Cuidado"
          items={[
            {
              q: "¿De dónde provienen sus materiales?",
              a: "Trabajamos con proveedores locales e internacionales certificados. Cada prenda indica su composición y origen en la etiqueta y en la ficha de producto online.",
            },
            {
              q: "¿Cómo debo cuidar mis prendas?",
              a: "Cada producto incluye instrucciones de cuidado específicas. Como regla general, recomendamos lavar en frío, no usar secadora y planchar a temperatura baja para preservar la calidad del tejido.",
            },
          ]}
          isLast
        />

        {/* CTA de contacto */}
        <div className="mt-16 border border-dashed border-border p-10 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            ¿No encontraste lo que buscabas?
          </p>
          <a href="/contacto" className="btn-primary">
            Escríbenos
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}

function FAQSection({
  title,
  items,
  isLast = false,
}: {
  title: string
  items: { q: string; a: string }[]
  isLast?: boolean
}) {
  return (
    <section className={isLast ? "" : "mb-12"}>
      <p className="section-label mb-6">{title}</p>
      <div className={`divide-y divide-border ${isLast ? "" : "border-b border-border"}`}>
        {items.map((item, i) => (
          <AccordionItem key={i} question={item.q} answer={item.a} index={i} />
        ))}
      </div>
    </section>
  )
}

function AccordionItem({
  question,
  answer,
  index,
}: {
  question: string
  answer: string
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="animate-fade-up delay-grid"
      style={{ "--i": index } as React.CSSProperties}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-foreground pr-8 group-hover:text-muted-foreground transition-colors">
          {question}
        </span>
        <span
          className={`shrink-0 text-muted-foreground transition-transform transition-duration-base ${open ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        className="grid accordion-transition"
        style={{
          "--grid-rows": open ? "1fr" : "0fr",
        } as React.CSSProperties}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-muted-foreground leading-relaxed pb-5">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}
