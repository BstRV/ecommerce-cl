export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-8 bg-muted rounded w-32 mb-8" />
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 py-6 border-b border-border">
            <div className="w-24 h-32 bg-muted rounded-[var(--brand-radius)] flex-shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/4 mt-auto" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
