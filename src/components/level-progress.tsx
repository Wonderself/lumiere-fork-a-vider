'use client'

import { cn } from '@/lib/utils'

const LEVEL_ORDER = ['ROOKIE', 'PRO', 'EXPERT', 'VIP'] as const

const LEVEL_THRESHOLDS: Record<string, number> = {
  ROOKIE: 0,
  PRO: 500,
  EXPERT: 2500,
  VIP: 10000,
}

const LEVEL_COLORS: Record<string, { text: string; bar: string; bg: string }> = {
  ROOKIE: { text: 'text-gray-400', bar: 'bg-gray-400', bg: 'bg-gray-400/10' },
  PRO: { text: 'text-blue-400', bar: 'bg-blue-500', bg: 'bg-blue-500/10' },
  EXPERT: { text: 'text-purple-400', bar: 'bg-purple-500', bg: 'bg-purple-500/10' },
  VIP: { text: 'text-[#E50914]', bar: 'bg-[#E50914]', bg: 'bg-[#E50914]/10' },
}

interface LevelProgressProps {
  level: string
  points: number
  compact?: boolean
}

export function LevelProgress({ level, points, compact = false }: LevelProgressProps) {
  const currentIndex = LEVEL_ORDER.indexOf(level as typeof LEVEL_ORDER[number])
  const isMaxLevel = currentIndex >= LEVEL_ORDER.length - 1

  const currentThreshold = LEVEL_THRESHOLDS[level] || 0
  const nextLevel = isMaxLevel ? null : LEVEL_ORDER[currentIndex + 1]
  const nextThreshold = nextLevel ? LEVEL_THRESHOLDS[nextLevel] : currentThreshold

  const progressInLevel = points - currentThreshold
  const levelRange = nextThreshold - currentThreshold
  const progressPct = isMaxLevel ? 100 : Math.min(100, Math.round((progressInLevel / levelRange) * 100))

  const colors = LEVEL_COLORS[level] || LEVEL_COLORS.ROOKIE

  if (compact) {
    return (
      <div className="flex items-center gap-3 w-full">
        <span className={cn('text-xs font-bold', colors.text)}>{level}</span>
        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-700', colors.bar)}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {nextLevel ? (
          <span className="text-[10px] text-white/30">{nextLevel}</span>
        ) : (
          <span className="text-[10px] text-[#E50914]">MAX</span>
        )}
      </div>
    )
  }

  return (
    <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('px-3 py-1 rounded-full text-xs font-bold', colors.bg, colors.text)}>
            {level}
          </span>
          <span className="text-sm text-white/50">{points.toLocaleString('fr-FR')} pts</span>
        </div>
        {nextLevel ? (
          <span className="text-xs text-white/30">
            {(nextThreshold - points).toLocaleString('fr-FR')} pts → {nextLevel}
          </span>
        ) : (
          <span className="text-xs text-[#E50914]">Niveau Maximum</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-1000', colors.bar)}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Level milestones */}
      <div className="flex justify-between mt-2">
        {LEVEL_ORDER.map((lvl, i) => {
          const isReached = i <= currentIndex
          const lvlColors = LEVEL_COLORS[lvl]
          return (
            <div key={lvl} className="flex flex-col items-center">
              <span className={cn(
                'text-[10px] font-medium',
                isReached ? lvlColors.text : 'text-white/15'
              )}>
                {lvl}
              </span>
              <span className={cn(
                'text-[9px]',
                isReached ? 'text-white/30' : 'text-white/10'
              )}>
                {LEVEL_THRESHOLDS[lvl].toLocaleString('fr-FR')}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
