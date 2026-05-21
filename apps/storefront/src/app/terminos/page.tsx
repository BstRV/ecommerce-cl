import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { PageHeader } from "@/components/PageHeader"

export const metadata = { title: "Términos y Condiciones" }

export default function TerminosPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="Términos y Condiciones"
        breadcrumbs={[{ label: "Términos" }]}
      />
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <div className="prose-custom space-y-10">
          <section>
            <p className="section-label mb-4">Última actualización: Enero 2025</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Los presentes términos y condiciones regulan el uso de la tienda online
              Preset y las compras realizadas a través de ella. Al navegar o comprar en
              nuestro sitio, aceptas estos términos en su totalidad.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">1. Identificación del Vendedor</h2>
            <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-none">
              <li><strong className="text-foreground">Razón social:</strong> Preset SpA</li>
              <li><strong className="text-foreground">Domicilio:</strong> Santiago, Región Metropolitana, Chile</li>
              <li><strong className="text-foreground">Correo:</strong> hola@preset.cl</li>
              <li><strong className="text-foreground">Horario de atención:</strong> Lunes a Viernes, 9:00 – 18:00</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">2. Productos y Precios</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todos los precios están expresados en pesos chilenos (CLP) e incluyen IVA (19%).
              Nos reservamos el derecho de modificar precios sin previo aviso, sin afectar
              pedidos ya confirmados. Las fotografías de los productos son referenciales;
              pueden existir variaciones menores de color según la calibración de cada pantalla.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">3. Proceso de Compra</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Al confirmar tu pedido, recibirás un correo electrónico de confirmación
              con los detalles de la compra y el número de seguimiento. La confirmación
              de pago genera una boleta electrónica (DTE) válida ante el SII, que podrás
              descargar desde tu cuenta o el correo de confirmación.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">4. Envíos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Los plazos de entrega son estimaciones y pueden variar según la disponibilidad
              del transportista. Santiago: 1-3 días hábiles. Regiones: 3-7 días hábiles.
              El envío es gratuito para compras superiores a $50.000 CLP.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">5. Derecho a Retracto</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              De acuerdo con la Ley del Consumidor (Ley N° 19.496), tienes derecho a retracto
              dentro de los 10 días siguientes a la recepción del producto. El producto debe
              estar sin uso, con sus etiquetas originales y en su empaque. Para ejercer este
              derecho, contáctanos a hola@preset.cl.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">6. Garantía Legal</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todos nuestros productos cuentan con la garantía legal de 6 meses establecida
              por la Ley del Consumidor. Si recibes un producto defectuoso o que no corresponde
              a lo comprado, puedes solicitar el cambio, reparación o devolución del dinero.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">7. Propiedad Intelectual</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todo el contenido de este sitio — incluyendo textos, imágenes, logotipos, diseños
              y código fuente — es propiedad de Preset SpA y está protegido por la legislación
              chilena e internacional de propiedad intelectual. Su uso no autorizado está prohibido.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">8. Legislación Aplicable</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Estos términos se rigen por las leyes de la República de Chile. Cualquier
              controversia será resuelta por los tribunales competentes de Santiago.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
