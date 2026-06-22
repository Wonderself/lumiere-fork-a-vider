'use client'

import { useState, useEffect } from 'react'
import { Coins } from 'lucide-react'

export function PointsDisplay() {
  const [points, setPoints] = useState(500)
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('cinegen-user-points')
    if (stored) {
      setPoints(Number(stored))
    } else {
      localStorage.setItem('cinegen-user-points', '500')
    }
  }, [])

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === 'cinegen-user-points' && e.newValue) {
        setPoints(Number(e.newValue))
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
        <Coins className="h-3.5 w-3.5 text-amber-400/60" />
        <span className="text-xs font-medium text-amber-400/60">&mdash;</span>
      </div>
    )
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/20 cursor-default transition-all duration-300 hover:bg-amber-500/[0.14] hover:border-amber-500/30">
        <Coins className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-xs font-semibold text-amber-400">
          {points.toLocaleString('fr-FR')} pts
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/[0.1] shadow-xl z-50 whitespace-nowrap">
          <p className="text-[11px] text-white/70 leading-relaxed">
            Gagnez des points en votant
          </p>
          <p className="text-[11px] text-amber-400/70 leading-relaxed">
            Convertissez en Premium
          </p>
          {/* Arrow */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1a1a] border-l border-t border-white/[0.1] rotate-45" />
        </div>
      )}
    </div>
  )
}
