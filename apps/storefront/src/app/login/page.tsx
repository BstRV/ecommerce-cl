"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { medusa } from "@/lib/medusa"
import { useCart } from "@/lib/cart-store"

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido").min(1, "El correo es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/cuenta"
  const { refreshCart } = useCart()
  
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
    setGeneralError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar con Zod
    const validation = loginSchema.safeParse(formData)
    if (!validation.success) {
      const fieldErrors: typeof errors = {}
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof typeof formData
        fieldErrors[path] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    startTransition(async () => {
      setGeneralError(null)
      const { token, error } = await medusa.login(formData.email, formData.password)
      
      if (error || !token) {
        setGeneralError(error || "Credenciales incorrectas")
        return
      }

      // Sincronizar el carrito de sesión
      try {
        await refreshCart()
      } catch (err) {
        console.error("Error refreshing cart after login:", err)
      }

      router.push(redirect)
      router.refresh()
    })
  }

  const handleGoogleLogin = () => {
    // Redirigir al flujo de Google OAuth expuesto por MedusaJS
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
    window.location.href = `${backendUrl}/auth/google`
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 bg-background relative overflow-hidden">
        {/* Subtle grid pattern — bg-grid-form de utilities.css */}
        <div className="bg-grid-form absolute inset-0" aria-hidden="true" />

        <div className="w-full max-w-md border border-border bg-background/80 backdrop-blur-md p-8 relative z-10 animate-fade-in shadow-sm">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-foreground mb-2">Ingresar</h1>
            <p className="text-sm text-muted-foreground">
              Accede a tu cuenta para gestionar tus compras
            </p>
          </div>

          {generalError && (
            <div className="mb-6 p-4 border border-destructive/20 bg-destructive/5 text-destructive text-sm text-center">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              {/* form-label de utilities.css */}
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              {/* form-input de utilities.css */}
              <input
                id="email"
                name="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? "form-input-error" : ""}`}
                disabled={isPending}
              />
              {errors.email && <p className="text-xs text-destructive mt-0.5">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                {/* form-label de utilities.css */}
                <label htmlFor="password" className="form-label">Contraseña</label>
                <Link
                  href="/ayuda"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              {/* form-input de utilities.css */}
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? "form-input-error" : ""}`}
                disabled={isPending}
              />
              {errors.password && <p className="text-xs text-destructive mt-0.5">{errors.password}</p>}
            </div>

            {/* btn-primary de utilities.css */}
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full mt-2"
            >
              {isPending ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground tracking-widest">O continuar con</span>
            </div>
          </div>

          {/* Google Login Button */}
          {/* btn-outline de utilities.css */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="btn-outline w-full py-3.5"
          >
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.23 2.68 1.255 6.618l4.01 3.147z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.275c0-.825-.075-1.625-.215-2.4H12v4.545h6.435a5.508 5.508 0 01-2.39 3.615l3.855 2.99c2.25-2.075 3.59-5.13 3.59-8.75z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235L1.255 17.38C3.23 21.32 7.27 24 12 24c3.155 0 6.005-1.045 8.01-2.83l-3.855-2.99a4.84 4.84 0 01-7.14-3.945z"
              />
              <path
                fill="#34A853"
                d="M12 4.91c1.39 0 2.635.48 3.615 1.415l3.49-3.49C17.065 1.05 14.73 0 12 0A7.058 7.058 0 005.265 9.765l4.01-3.147c.56-1.695 2.125-2.845 3.725-2.845z"
              />
            </svg>
            <span className="text-sm font-medium text-foreground">Google</span>
          </button>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="text-foreground font-medium hover:underline underline-offset-4">
              Crea una aquí
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
