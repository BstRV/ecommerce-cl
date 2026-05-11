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
          className="px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity rounded-[var(--brand-radius)]"
        >
          Ir al inicio
        </Link>
        <Link
          href="/colecciones"
          className="px-6 py-2.5 text-sm font-medium border border-border hover:bg-muted transition-colors rounded-[var(--brand-radius)]"
        >
          Ver colecciones
        </Link>
      </div>
    </main>
  )
}
