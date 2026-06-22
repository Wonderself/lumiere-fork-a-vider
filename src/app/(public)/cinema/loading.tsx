export default function CinemaLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 py-12 sm:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-10 animate-pulse">
        {/* Page header skeleton */}
        <div>
          <div className="h-8 w-48 bg-zinc-800 rounded-lg mb-3" />
          <div className="h-4 w-80 bg-zinc-800/60 rounded-lg" />
        </div>
        {/* Featured film skeleton */}
        <div className="rounded-2xl overflow-hidden bg-zinc-800 h-[280px] sm:h-[360px] relative">
          <div className="absolute bottom-8 left-8 space-y-3">
            <div className="h-7 w-64 bg-zinc-700 rounded-lg" />
            <div className="h-4 w-96 bg-zinc-700/60 rounded-lg" />
          </div>
        </div>
        {/* Films grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[2/3] rounded-xl bg-zinc-800" />
              <div className="mt-2 space-y-1.5">
                <div className="h-4 w-3/4 bg-zinc-800/60 rounded" />
                <div className="h-3 w-1/2 bg-zinc-800/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
