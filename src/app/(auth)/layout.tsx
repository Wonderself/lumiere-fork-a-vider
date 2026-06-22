import Link from 'next/link'
import { Clapperboard } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#E50914]/[0.04] blur-[180px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#E50914]/[0.03] blur-[150px]" />
        <div className="absolute top-[60%] left-[60%] w-[300px] h-[300px] rounded-full bg-[#FF2D2D]/[0.02] blur-[120px]" />
        {/* Subtle film grain overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] opacity-40" />
      </div>

      {/* Auth Header */}
      <div className="p-8 sm:p-10 relative z-10">
        <Link href="/" className="group flex items-center gap-2.5 w-fit transition-opacity duration-500 hover:opacity-80">
          <div className="relative">
            <Clapperboard className="h-7 w-7 text-[#E50914] transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-[#E50914]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <span className="text-lg font-black text-white/90 tracking-[0.15em]">
            CINE<span className="text-[#E50914]">GEN</span>
          </span>
        </Link>
      </div>

      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-20 sm:py-24 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="relative z-10 px-4 sm:px-8 pb-14">
        <div className="h-px bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent" />
        <p className="text-center text-xs text-white/20 mt-6">
          &copy; {new Date().getFullYear()} CINEGENY Studio
        </p>
      </div>
    </div>
  )
}
