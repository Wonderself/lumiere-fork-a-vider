export default function ProfileLoading() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-pulse">
      {/* Profile card skeleton */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="h-24 w-24 bg-white/[0.08] rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 bg-white/[0.08] rounded-lg" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-white/[0.05] rounded-full" />
              <div className="h-6 w-24 bg-white/[0.05] rounded-full" />
            </div>
            <div className="h-4 w-56 bg-white/[0.05] rounded" />
          </div>
        </div>
      </div>
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl border border-white/10 p-5 text-center">
            <div className="h-11 w-11 bg-white/[0.05] rounded-xl mx-auto mb-3" />
            <div className="h-7 w-16 bg-white/[0.08] rounded-lg mx-auto mb-2" />
            <div className="h-3 w-24 bg-white/[0.05] rounded mx-auto" />
          </div>
        ))}
      </div>
      {/* Progress skeleton */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <div className="h-5 w-32 bg-white/[0.08] rounded-lg mb-4" />
        <div className="h-2.5 w-full bg-white/[0.05] rounded-full" />
      </div>
    </div>
  )
}
