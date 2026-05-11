export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen */}
        <div className="aspect-square bg-muted rounded-[var(--brand-radius)]" />
        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-6 bg-muted rounded w-1/4 mt-2" />
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-10 bg-muted rounded" />
            ))}
          </div>
          <div className="h-12 bg-muted rounded mt-4" />
        </div>
      </div>
    </main>
  )
}
