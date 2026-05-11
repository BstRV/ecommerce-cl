import SkeletonGrid from '@/components/SkeletonGrid'

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header skeleton */}
      <div className="mb-10 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-3" />
        <div className="h-4 bg-muted rounded w-64" />
      </div>
      <SkeletonGrid count={8} />
    </main>
  )
}
