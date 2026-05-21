import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Número 404 estilizado */}
      <p className="font-display text-[8rem] leading-none text-muted mb-2 select-none">
        404
      </p>
      <div className="h-px w-16 bg-border mx-auto mb-6" />

      <h1 className="font-display text-2xl mb-3 tracking-tight">
        Página no encontrada
      </h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        La página que buscas no existe o fue movida a otra dirección.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="btn-primary"
        >
          Ir al inicio
        </Link>
        <Link
          href="/colecciones"
          className="btn-outline"
        >
          Ver colecciones
        </Link>
      </div>
    </main>
  )
}
