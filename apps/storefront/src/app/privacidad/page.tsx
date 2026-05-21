import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { PageHeader } from "@/components/PageHeader"

export const metadata = { title: "Política de Privacidad" }

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="Política de Privacidad"
        breadcrumbs={[{ label: "Privacidad" }]}
      />
      <main className="max-w-3xl mx-auto px-6 pb-24">
        <div className="prose-custom space-y-10">
          <section>
            <p className="section-label mb-4">Última actualización: Enero 2025</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              En Preset, nos comprometemos a proteger tu privacidad. Esta política describe cómo
              recopilamos, usamos y protegemos tu información personal de acuerdo con la legislación
              chilena vigente, incluyendo la Ley N° 19.628 sobre Protección de la Vida Privada.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">1. Información que Recopilamos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Recopilamos información que nos proporcionas directamente al crear una cuenta, realizar una compra o contactarnos:
            </p>
            <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>Nombre completo y RUT</li>
              <li>Correo electrónico y número de teléfono</li>
              <li>Dirección de envío y facturación</li>
              <li>Historial de compras y preferencias</li>
              <li>Información de navegación (cookies funcionales)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">2. Uso de la Información</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">Utilizamos tu información para:</p>
            <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>Procesar y entregar tus pedidos</li>
              <li>Emitir boletas electrónicas (DTE) válidas ante el SII</li>
              <li>Enviar confirmaciones de compra y actualizaciones de envío</li>
              <li>Mejorar tu experiencia de compra mediante análisis internos</li>
              <li>Responder a tus consultas y solicitudes de soporte</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">3. Protección de Datos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu
              información personal. Todas las transacciones se procesan con cifrado SSL de 256 bits.
              No almacenamos datos de tarjetas de crédito o débito en nuestros servidores;
              estos son procesados directamente por nuestro proveedor de pagos certificado.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">4. Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Utilizamos cookies funcionales estrictamente necesarias para el funcionamiento de la
              tienda: sesión de carrito de compras, preferencias de tema visual y autenticación.
              No utilizamos cookies de publicidad ni de rastreo de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">5. Tus Derechos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Conforme a la legislación chilena, tienes derecho a:
            </p>
            <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc list-inside">
              <li>Acceder a tus datos personales almacenados</li>
              <li>Solicitar la rectificación de información incorrecta</li>
              <li>Solicitar la eliminación de tu cuenta y datos</li>
              <li>Revocar el consentimiento para comunicaciones comerciales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-foreground mb-4">6. Contacto</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Para ejercer tus derechos o resolver cualquier duda sobre esta política, escríbenos a{" "}
              <a href="mailto:hola@preset.cl" className="link-underline">hola@preset.cl</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
