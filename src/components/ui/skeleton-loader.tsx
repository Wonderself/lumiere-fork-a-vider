import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-gray-200', className)} />
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-3">
        <Skeleton className="h-4 w-full max-w-xs" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-2.5 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  )
}

export function SkeletonKPIGrid({ count = 6 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(count, 6)} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
