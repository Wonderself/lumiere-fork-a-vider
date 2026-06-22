export default function StreamingLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 py-12 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-10 animate-pulse">
        {/* Hero / featured section skeleton */}
        <div className="relative rounded-2xl overflow-hidden bg-zinc-800 h-[300px] sm:h-[400px]">
          <div className="absolute bottom-8 left-8 space-y-3">
            <div className="h-8 w-72 bg-zinc-700 rounded-lg" />
            <div className="h-4 w-96 bg-zinc-700/60 rounded-lg" />
            <div className="h-10 w-36 bg-zinc-700 rounded-xl mt-2" />
          </div>
        </div>
        {/* Film row skeletons */}
        {Array.from({ length: 3 }).map((_, row) => (
          <div key={row} className="space-y-4">
            <div className="h-6 w-48 bg-zinc-800 rounded-lg" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[180px]">
                  <div className="aspect-[2/3] rounded-xl bg-zinc-800" />
                  <div className="mt-2 h-4 w-28 bg-zinc-800/60 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
