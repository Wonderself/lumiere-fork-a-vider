export default function TasksLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-56 bg-white/[0.08] rounded-lg mb-3" />
        <div className="h-4 w-80 bg-white/[0.05] rounded-lg" />
      </div>
      {/* Filters skeleton */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-white/[0.05] rounded-xl" />
          ))}
        </div>
      </div>
      {/* Task cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/[0.05] rounded-xl" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-white/[0.08] rounded mb-2" />
                <div className="h-3 w-20 bg-white/[0.05] rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/[0.05] rounded" />
              <div className="h-3 w-3/4 bg-white/[0.03] rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-white/[0.05] rounded-full" />
              <div className="h-6 w-20 bg-white/[0.05] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
