'use client'

import { getXPProgress, getStreakMultiplier } from '@/data/engagement'
import { Flame, TrendingUp, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface XPProgressBarProps {
  xp: number
  streak?: number
  compact?: boolean
}

export function XPProgressBar({ xp, streak = 0, compact }: XPProgressBarProps) {
  const { level, nextLevel, progress, remaining } = getXPProgress(xp)
  const multiplier = getStreakMultiplier(streak)

  if (compact) {
    return (
      <Link href="/rewards" className="flex items-center gap-3 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.03] transition-colors">
        <span className="text-lg">{level.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-semibold text-[#1A1A2E]">{level.title}</span>
            <span className="text-[10px] text-gray-400">Niv.{level.level}</span>
          </div>
          <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: level.color }} />
          </div>
        </div>
        {streak > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-orange-500">
            <Flame className="h-3 w-3" />{streak}j
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-gray-300" />
      </Link>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-3xl">{level.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{level.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">Niv. {level.level}</span>
          </div>
          <p className="text-xs text-gray-400">{xp.toLocaleString()} XP</p>
        </div>
        {streak > 0 && (
          <div className="text-center px-4 py-2 rounded-xl border border-gray-800">
            <Flame className="h-5 w-5 text-orange-500 mx-auto" />
            <p className="text-sm font-bold text-white">{streak}j</p>
            <p className="text-[10px] text-orange-400">{multiplier.emoji} x{multiplier.multiplier}</p>
          </div>
        )}
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-1">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: level.color }} />
      </div>
      <div className="flex justify-between text-[10px] text-white/50">
        <span>{level.title}</span>
        {nextLevel && <span>{remaining} XP → {nextLevel.title} {nextLevel.icon}</span>}
      </div>
      <Link href="/rewards" className="mt-3 flex items-center gap-1 text-xs text-[#E50914] hover:underline">
        <TrendingUp className="h-3.5 w-3.5" /> Voir toutes les récompenses
      </Link>
    </div>
  )
}
