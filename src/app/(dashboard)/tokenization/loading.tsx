export default function TokenizationLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      {/* Nav skeleton */}
      <div className="h-11 w-80 bg-white/[0.05] rounded-xl" />
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-50/50 to-white p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="h-6 w-48 bg-white/[0.08] rounded-full" />
            <div className="h-10 w-80 bg-white/[0.08] rounded-lg" />
            <div className="h-4 w-96 bg-white/[0.05] rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-72">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-7 w-20 bg-white/[0.08] rounded-lg mb-1" />
                <div className="h-3 w-16 bg-white/[0.05] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="h-36 bg-white/[0.05]" />
            <div className="p-4 space-y-3">
              <div className="h-1.5 bg-white/[0.05] rounded-full" />
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-white/[0.08] rounded" />
                <div className="h-4 w-16 bg-white/[0.05] rounded" />
              </div>
              <div className="h-10 bg-white/[0.05] rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
