export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="flex gap-3 mb-10">
        <div className="h-4 bg-muted rounded w-16" />
        <div className="h-4 bg-muted rounded w-4" />
        <div className="h-4 bg-muted rounded w-16" />
        <div className="h-4 bg-muted rounded w-4" />
        <div className="h-4 bg-muted rounded w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
        <div className="flex flex-col gap-4">
          <div className="h-8 bg-muted rounded w-48 mb-2" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-11 bg-muted rounded" />
          ))}
          <div className="h-12 bg-muted rounded mt-2" />
        </div>
        <div className="h-48 bg-muted rounded" />
      </div>
    </main>
  )
}
