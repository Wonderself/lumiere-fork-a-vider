'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface BadgeItem {
  type: string
  name: string
  description: string
  icon: string
  category: string
  earned: boolean
  earnedAt?: Date | string | null
}

interface BadgeShowcaseProps {
  badges: BadgeItem[]
  compact?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  contribution: 'Contribution',
  quality: 'Qualite',
  community: 'Communaute',
  special: 'Special',
}

export function BadgeShowcase({ badges, compact = false }: BadgeShowcaseProps) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null)

  const earned = badges.filter(b => b.earned)
  const unearned = badges.filter(b => !b.earned)

  if (compact) {
    // Compact mode: just show earned badges as a row
    if (earned.length === 0) return null
    return (
      <div className="flex flex-wrap gap-2">
        {earned.map((badge) => (
          <div
            key={badge.type}
            className="relative group"
            onMouseEnter={() => setHoveredBadge(badge.type)}
            onMouseLeave={() => setHoveredBadge(null)}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20 cursor-default">
              <span>{badge.icon}</span>
              {badge.name}
            </span>
            {hoveredBadge === badge.type && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-xs text-white/70 whitespace-nowrap z-50 shadow-xl">
                {badge.description}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Full mode: grid with all badges (earned + locked)
  const grouped = Object.entries(
    badges.reduce<Record<string, BadgeItem[]>>((acc, badge) => {
      const cat = badge.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(badge)
      return acc
    }, {})
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-playfair">
          Badges & Achievements
        </h2>
        <span className="text-sm text-white/30">
          {earned.length}/{badges.length} debloques
        </span>
      </div>

      {grouped.map(([category, categoryBadges]) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categoryBadges.map((badge) => (
              <div
                key={badge.type}
                className={cn(
                  'relative p-4 rounded-xl border text-center transition-all duration-300',
                  badge.earned
                    ? 'border-[#E50914]/20 bg-[#E50914]/[0.04] hover:border-[#E50914]/40'
                    : 'border-white/[0.04] bg-white/[0.01] opacity-40'
                )}
              >
                <div className={cn(
                  'text-3xl mb-2',
                  !badge.earned && 'grayscale'
                )}>
                  {badge.icon}
                </div>
                <p className={cn(
                  'text-xs font-semibold mb-1',
                  badge.earned ? 'text-white/80' : 'text-white/30'
                )}>
                  {badge.name}
                </p>
                <p className="text-[10px] text-white/25 line-clamp-2">
                  {badge.description}
                </p>
                {badge.earned && badge.earnedAt && (
                  <p className="text-[9px] text-[#E50914]/50 mt-2">
                    {new Intl.DateTimeFormat('fr-FR').format(new Date(badge.earnedAt))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
