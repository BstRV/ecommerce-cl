"use client"

import { useState, useEffect, startTransition } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { medusa, cookies } from "@/lib/medusa"
import { useCart } from "@/lib/cart-store"
import { formatPrice, type Customer, type Order, type CurrencyCode } from "@ecommerce-preset/types"

export default function CuentaPage() {
  const router = useRouter()
  const { refreshCart } = useCart()
  
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadData() {
      const jwt = cookies.get("medusa_jwt")
      if (!jwt) {
        router.push("/login?redirect=/cuenta")
        return
      }

      try {
        const profile = await medusa.getCustomer()
        if (!profile) {
          // Si falló u expiró el JWT, limpiar y redirigir
          cookies.delete("medusa_jwt")
          router.push("/login?redirect=/cuenta")
          return
        }

        setCustomer(profile)
        const history = await medusa.getCustomerOrders()
        setOrders(history)
      } catch (err) {
        console.error("Error loading account data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    cookies.delete("medusa_jwt")
    cookies.delete("medusa_customer_id")
    
    // Reestablecer/crear un carrito anónimo
    try {
      await refreshCart()
    } catch (err) {
      console.error("Error refreshing cart after logout:", err)
    }

    startTransition(() => {
      router.push("/login")
      router.refresh()
    })
  }

  // Skeletons para carga premium
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 pt-28 pb-24 min-h-[85vh]">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-48 bg-secondary" />
            <div className="grid md:grid-cols-[280px_1fr] gap-12">
              <div className="space-y-4">
                <div className="h-6 w-32 bg-secondary" />
                <div className="h-40 bg-secondary" />
              </div>
              <div className="space-y-4">
                <div className="h-6 w-48 bg-secondary" />
                <div className="h-64 bg-secondary" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const rut = (customer?.metadata?.rut as string) || "No registrado"

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-24 min-h-[85vh]">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border pb-6 mb-12 gap-4">
          <h1 className="font-display text-5xl text-foreground">Mi Cuenta</h1>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="grid md:grid-cols-[280px_1fr] gap-12 items-start">
          {/* Sidebar: Información de perfil */}
          <aside className="border border-border p-6 bg-background/50">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
              Datos Personales
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Nombre completo</p>
                <p className="font-medium text-foreground">
                  {customer?.firstName} {customer?.lastName}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">RUT</p>
                <p className="font-medium text-foreground">{rut}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Correo electrónico</p>
                <p className="font-medium text-foreground break-all">{customer?.email}</p>
              </div>

              {customer?.phone && (
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="font-medium text-foreground">{customer.phone}</p>
                </div>
              )}
            </div>
          </aside>

          {/* Historial de órdenes */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
              Historial de Pedidos
            </h2>

            {orders.length === 0 ? (
              <div className="border border-dashed border-border p-12 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Aún no has realizado ningún pedido.
                </p>
                <a
                  href="/colecciones"
                  className="inline-block bg-foreground text-background px-6 py-3 text-xs font-medium tracking-widest uppercase hover:bg-foreground/85 transition-colors"
                >
                  Comenzar a comprar
                </a>
              </div>
            ) : (
              <div className="border border-border overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-xs tracking-wider uppercase text-muted-foreground">
                      <th className="p-4 font-semibold">Pedido</th>
                      <th className="p-4 font-semibold">Fecha</th>
                      <th className="p-4 font-semibold">Estado</th>
                      <th className="p-4 font-semibold">Total</th>
                      <th className="p-4 font-semibold text-right">Factura (DTE)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const totalAmount = order.total || 0
                      const date = new Date(order.created_at).toLocaleDateString("es-CL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      
                      // Formatear estados en español
                      const statusMap: Record<string, string> = {
                        pending: "Pendiente",
                        completed: "Completado",
                        canceled: "Cancelado",
                        processing: "Procesando",
                      }
                      const statusDisplay = statusMap[order.status] || order.status

                      return (
                        <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                          <td className="p-4 font-medium text-foreground">
                            #{order.display_id || order.id.slice(-6).toUpperCase()}
                          </td>
                          <td className="p-4 text-muted-foreground">{date}</td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-0.5 text-xs font-medium border ${
                              order.status === "completed"
                                ? "bg-green-500/5 text-green-600 border-green-200"
                                : order.status === "canceled"
                                ? "bg-red-500/5 text-red-600 border-red-200"
                                : "bg-orange-500/5 text-orange-600 border-orange-200"
                            }`}>
                              {statusDisplay}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-foreground">
                            {formatPrice(totalAmount, (order.currency_code || "CLP").toUpperCase() as CurrencyCode)}
                          </td>
                          <td className="p-4 text-right">
                            {order.metadata?.dte_pdf_url ? (
                              <a
                                href={order.metadata.dte_pdf_url as string}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-foreground font-semibold hover:underline"
                              >
                                Descargar PDF
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">
                                Disponible en Fase 2
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
