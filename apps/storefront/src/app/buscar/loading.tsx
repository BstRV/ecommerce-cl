import SkeletonGrid from '@/components/SkeletonGrid'

export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12 animate-pulse">
        <div className="h-12 bg-muted rounded w-3/4 mb-4" />
        <div className="h-px bg-border w-full" />
      </div>
      <SkeletonGrid count={8} />
    </main>
  )
}
