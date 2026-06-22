export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-[#E50914]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E50914] animate-spin" />
        </div>
        <p className="text-sm text-white/30 animate-pulse">Chargement...</p>
      </div>
    </div>
  )
}
