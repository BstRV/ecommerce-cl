'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registrar el error en consola (reemplazar con logging real en producción)
    console.error(error)
  }, [error])

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Motivo geométrico — consistente con EmptyState */}
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 border border-border rotate-45" />
        <div className="absolute inset-2 border border-border rotate-12" />
        <div className="absolute inset-4 border border-border" />
      </div>

      <h1 className="font-display text-4xl mb-3 tracking-tight">
        Algo salió mal
      </h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-md">
        Ocurrió un error inesperado. Puedes intentar de nuevo o volver al inicio.
      </p>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="btn-primary"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          className="btn-outline"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
