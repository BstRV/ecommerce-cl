import SkeletonGrid from '@/components/SkeletonGrid'

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* PageHeader skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-10 bg-muted rounded w-64 mb-3" />
        <div className="h-4 bg-muted rounded w-48" />
      </div>
      {/* FilterBar skeleton */}
      <div className="flex gap-3 mb-8 animate-pulse overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 bg-muted rounded-full w-24 flex-shrink-0" />
        ))}
      </div>
      <SkeletonGrid count={12} />
    </main>
  )
}
