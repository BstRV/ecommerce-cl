"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { medusa } from "@/lib/medusa"
import { useCart } from "@/lib/cart-store"

/**
 * Valida un RUT chileno usando el algoritmo Módulo 11.
 */
function validateRut(rut: string): boolean {
  const cleanRut = rut.replace(/[^0-9kK]/g, "")
  if (cleanRut.length < 2) return false

  const body = cleanRut.slice(0, -1)
  const dv = cleanRut.slice(-1).toUpperCase()

  let sum = 0
  let multiplier = 2

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier
    multiplier = multiplier === 7 ? 2 : multiplier + 1
  }

  const expectedDv = 11 - (sum % 11)
  const expectedDvChar = expectedDv === 11 ? "0" : expectedDv === 10 ? "K" : expectedDv.toString()

  return dv === expectedDvChar
}

/**
 * Formatea un RUT mientras el usuario escribe (ej: 12.345.678-9).
 */
function formatRut(rut: string): string {
  const clean = rut.replace(/[^0-9kK]/g, "")
  if (clean.length === 0) return ""
  if (clean.length === 1) return clean

  const dv = clean.slice(-1)
  const body = clean.slice(0, -1)

  // Agregar puntos cada miles
  let formattedBody = ""
  for (let i = body.length - 1, j = 1; i >= 0; i--, j++) {
    formattedBody = body[i] + formattedBody
    if (j % 3 === 0 && i !== 0) {
      formattedBody = "." + formattedBody
    }
  }

  return `${formattedBody}-${dv}`
}

const registerSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido").trim(),
  lastName: z.string().min(1, "El apellido es requerido").trim(),
  email: z.string().email("Correo electrónico inválido").min(1, "El correo es requerido"),
  rut: z.string().refine(validateRut, "RUT chileno inválido (ej: 19.123.456-k)"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export default function RegistroPage() {
  const router = useRouter()
  const { refreshCart } = useCart()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rut: "",
    password: "",
  })
  
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let updatedValue = value

    if (name === "rut") {
      updatedValue = formatRut(value)
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
    setGeneralError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = registerSchema.safeParse(formData)
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

      // 1. Registrar usuario en Auth Provider de Medusa
      const { ok, error: regError } = await medusa.register(formData.email, formData.password)
      
      if (!ok || regError) {
        setGeneralError(regError || "Error en el registro del usuario")
        return
      }

      // 2. Iniciar sesión automáticamente para obtener JWT
      const { token, error: loginError } = await medusa.login(formData.email, formData.password)
      
      if (!token || loginError) {
        setGeneralError("Usuario creado, pero hubo un error al iniciar sesión automáticamente")
        return
      }

      // 3. Crear o actualizar el perfil de cliente asociado en Medusa Store
      try {
        await medusa.updateCustomer(
          formData.firstName,
          formData.lastName,
          "", // telefono opcional
          formData.rut
        )
      } catch (err) {
        console.error("Error setting customer profile information:", err)
      }

      // 4. Sincronizar el carrito de sesión
      try {
        await refreshCart()
      } catch (err) {
        console.error("Error refreshing cart after registration:", err)
      }

      router.push("/cuenta")
      router.refresh()
    })
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16 bg-background relative overflow-hidden">
        {/* Subtle grid pattern — bg-grid-form de utilities.css */}
        <div className="bg-grid-form absolute inset-0" aria-hidden="true" />

        <div className="w-full max-w-md border border-border bg-background/80 backdrop-blur-md p-8 relative z-10 animate-fade-in shadow-sm">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-foreground mb-2">Crear Cuenta</h1>
            <p className="text-sm text-muted-foreground">
              Únete a nosotros y registra tu historial de compras
            </p>
          </div>

          {generalError && (
            <div className="mb-6 p-4 border border-destructive/20 bg-destructive/5 text-destructive text-sm text-center">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                {/* form-label de utilities.css */}
                <label htmlFor="firstName" className="form-label">Nombre</label>
                {/* form-input de utilities.css */}
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Juan"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.firstName ? "form-input-error" : ""}`}
                  disabled={isPending}
                />
                {errors.firstName && <p className="text-xs text-destructive mt-0.5">{errors.firstName}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastName" className="form-label">Apellido</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Pérez"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.lastName ? "form-input-error" : ""}`}
                  disabled={isPending}
                />
                {errors.lastName && <p className="text-xs text-destructive mt-0.5">{errors.lastName}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="rut" className="form-label">RUT</label>
              <input
                id="rut"
                name="rut"
                type="text"
                placeholder="12.345.678-9"
                value={formData.rut}
                onChange={handleInputChange}
                className={`form-input ${errors.rut ? "form-input-error" : ""}`}
                disabled={isPending}
              />
              {errors.rut && <p className="text-xs text-destructive mt-0.5">{errors.rut}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
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
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
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
              {isPending ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-foreground font-medium hover:underline underline-offset-4">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
