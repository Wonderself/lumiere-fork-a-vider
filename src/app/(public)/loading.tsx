export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-[#E50914]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E50914] animate-spin" />
        </div>
        <p className="text-sm text-white/30 animate-pulse">Chargement...</p>
      </div>
    </div>
  )
}
