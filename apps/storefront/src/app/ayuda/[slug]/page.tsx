import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import type { Metadata } from 'next'

const HELP_CONTENT: Record<string, { title: string; subtitle: string; sections: { heading: string; body: string }[] }> = {
  envios: {
    title: 'Envíos',
    subtitle: 'Todo lo que necesitas saber sobre cómo recibir tu pedido.',
    sections: [
      {
        heading: 'Tiempo de despacho',
        body: 'Los pedidos se despachan en un plazo de 1 a 2 días hábiles desde la confirmación del pago. Recibirás un correo con el número de seguimiento una vez que tu paquete esté en camino.',
      },
      {
        heading: 'Cobertura',
        body: 'Realizamos envíos a todo Chile continental a través de nuestros servicios de courier. Para pedidos a regiones extremas (Aysén, Magallanes, Arica), el plazo puede extenderse hasta 5 días hábiles.',
      },
      {
        heading: 'Costo de envío',
        body: 'El costo de envío se calcula según tu dirección y el peso del pedido. Los envíos son gratuitos para compras sobre $49.990 CLP.',
      },
      {
        heading: '¿Puedo retirar en tienda?',
        body: 'Por el momento solo realizamos envíos a domicilio. Próximamente habilitaremos retiro en tienda en Santiago.',
      },
    ],
  },
  devoluciones: {
    title: 'Devoluciones',
    subtitle: 'Tu satisfacción es nuestra prioridad.',
    sections: [
      {
        heading: 'Política de cambios',
        body: 'Aceptamos cambios dentro de los 30 días corridos desde la recepción del producto, siempre que este se encuentre en su estado original: sin usar, con etiquetas y en su embalaje original.',
      },
      {
        heading: 'Productos no intercambiables',
        body: 'Por higiene, no aceptamos devoluciones de ropa interior, trajes de baño ni accesorios de cabello.',
      },
      {
        heading: 'Proceso de devolución',
        body: 'Para iniciar una devolución, escríbenos a hola@preset.cl con tu número de pedido y el motivo. Te enviaremos las instrucciones en un plazo de 24 horas hábiles.',
      },
      {
        heading: 'Reembolso',
        body: 'Una vez recibido y revisado el producto, el reembolso se procesa en 3 a 5 días hábiles a la misma forma de pago original.',
      },
    ],
  },
  tallas: {
    title: 'Guía de Tallas',
    subtitle: 'Encuentra tu talla perfecta.',
    sections: [
      {
        heading: 'Cómo medir',
        body: 'Para obtener medidas precisas, usa una cinta métrica flexible. Mide el contorno de tu pecho, cintura y cadera en centímetros.',
      },
      {
        heading: 'Tabla de equivalencias',
        body: 'XS: Pecho 80–84 cm / Cintura 60–64 cm\nS: Pecho 84–88 cm / Cintura 64–68 cm\nM: Pecho 88–92 cm / Cintura 68–72 cm\nL: Pecho 92–96 cm / Cintura 72–76 cm\nXL: Pecho 96–100 cm / Cintura 76–80 cm',
      },
      {
        heading: 'Consejos',
        body: 'Si estás entre dos tallas, te recomendamos elegir la talla más grande para mayor comodidad. Todos nuestros productos incluyen la composición del tejido y recomendaciones de cuidado en la etiqueta.',
      },
    ],
  },
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(HELP_CONTENT).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const content = HELP_CONTENT[slug]
  if (!content) return {}
  return {
    title: `${content.title} | Preset`,
    description: content.subtitle,
  }
}

export default async function HelpPage({ params }: Props) {
  const { slug } = await params
  const content = HELP_CONTENT[slug]

  if (!content) notFound()

  return (
    <>
      <PageHeader
        title={content.title}
        subtitle={content.subtitle}
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Ayuda', href: '#' },
          { label: content.title },
        ]}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col gap-10">
          {content.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-base font-medium mb-3 tracking-tight">
                {section.heading}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* CTA de contacto al pie */}
        <div className="mt-14 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            ¿No encontraste lo que buscabas?
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </>
  )
}
