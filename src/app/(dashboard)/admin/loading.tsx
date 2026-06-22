export default function AdminLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-64 bg-white/[0.08] rounded-lg mb-2" />
        <div className="h-4 w-96 bg-white/[0.05] rounded-lg" />
      </div>
      {/* KPI grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <div className="h-10 w-10 bg-white/[0.05] rounded-xl mb-3" />
            <div className="h-7 w-20 bg-white/[0.08] rounded-lg mb-2" />
            <div className="h-3 w-24 bg-white/[0.05] rounded" />
          </div>
        ))}
      </div>
      {/* Table skeleton */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="h-5 w-48 bg-white/[0.08] rounded-lg" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b border-white/10">
            <div className="h-8 w-8 bg-white/[0.05] rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-white/[0.05] rounded" />
              <div className="h-3 w-24 bg-white/[0.03] rounded" />
            </div>
            <div className="h-6 w-16 bg-white/[0.05] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
