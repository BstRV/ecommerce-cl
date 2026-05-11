export default function SkeletonCard() {
  return (
    <div className="group animate-pulse">
      {/* Imagen placeholder */}
      <div className="aspect-[3/4] w-full bg-muted rounded-[var(--brand-radius)] mb-4" />
      {/* Título */}
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      {/* Subtítulo */}
      <div className="h-3 bg-muted rounded w-1/2 mb-3" />
      {/* Precio */}
      <div className="h-4 bg-muted rounded w-1/3" />
    </div>
  )
}
