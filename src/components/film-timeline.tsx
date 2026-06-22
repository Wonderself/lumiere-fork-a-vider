'use client'

import { useState } from 'react'
import { CheckCircle, Lock, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PHASE_LABELS } from '@/lib/constants'

interface Phase {
  id: string
  phaseName: string
  phaseOrder: number
  status: string
  _count: { tasks: number }
  tasks: { id: string; title: string; type: string; status: string; priceEuros: number }[]
}

interface FilmTimelineProps {
  phases: Phase[]
}

export function FilmTimeline({ phases }: FilmTimelineProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null)

  const completedCount = phases.filter(p => p.status === 'COMPLETED').length
  const totalCount = phases.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div>
      {/* Progress header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-playfair">
          Timeline de Production
        </h2>
        <span className="text-sm text-white/40">
          {completedCount}/{totalCount} phases
        </span>
      </div>

      {/* Horizontal timeline bar (desktop) */}
      <div className="hidden md:block mb-8">
        <div className="relative">
          {/* Track */}
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Phase dots */}
          <div className="flex justify-between mt-3">
            {phases.map((phase) => {
              const isCompleted = phase.status === 'COMPLETED'
              const isActive = phase.status === 'ACTIVE'
              const isExpanded = expandedPhase === phase.id

              return (
                <button
                  key={phase.id}
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className="flex flex-col items-center group cursor-pointer"
                  style={{ width: `${100 / phases.length}%` }}
                >
                  <div
                    className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300',
                      isCompleted && 'bg-green-500/20 text-green-400 ring-2 ring-green-500/30',
                      isActive && 'bg-[#E50914]/20 text-[#E50914] ring-2 ring-[#E50914]/30 animate-pulse',
                      !isCompleted && !isActive && 'bg-white/5 text-white/20',
                      isExpanded && 'scale-110'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4" />
                    ) : (
                      <Lock className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span className={cn(
                    'text-[10px] mt-1.5 font-medium transition-colors',
                    isCompleted ? 'text-green-400/60' : isActive ? 'text-[#E50914]' : 'text-white/20',
                    'group-hover:text-white/50'
                  )}>
                    {(PHASE_LABELS as Record<string, string>)[phase.phaseName] || phase.phaseName}
                  </span>
                  <span className="text-[9px] text-white/15 mt-0.5">
                    {phase._count.tasks} tache{phase._count.tasks !== 1 ? 's' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Vertical timeline (mobile + expandable details) */}
      <div className="space-y-2">
        {phases.map((phase, i) => {
          const isCompleted = phase.status === 'COMPLETED'
          const isActive = phase.status === 'ACTIVE'
          const isExpanded = expandedPhase === phase.id
          const hasTasks = phase.tasks.length > 0

          return (
            <div key={phase.id}>
              <button
                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left',
                  isCompleted && 'border-green-500/15 bg-green-500/[0.03]',
                  isActive && 'border-[#E50914]/20 bg-[#E50914]/[0.04]',
                  !isCompleted && !isActive && 'border-white/[0.04] bg-white/[0.01] opacity-50',
                  isExpanded && 'border-[#E50914]/30'
                )}
              >
                {/* Phase number */}
                <div className={cn(
                  'h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                  isCompleted && 'bg-green-500/15 text-green-400',
                  isActive && 'bg-[#E50914]/15 text-[#E50914]',
                  !isCompleted && !isActive && 'bg-white/5 text-white/20'
                )}>
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : phase.phaseOrder}
                </div>

                {/* Phase info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate">
                      {(PHASE_LABELS as Record<string, string>)[phase.phaseName] || phase.phaseName}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-[#E50914]/15 text-[#E50914] text-[10px] font-bold">
                        EN COURS
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/25">{phase._count.tasks} tache{phase._count.tasks !== 1 ? 's' : ''}</span>
                </div>

                {/* Expand icon */}
                {hasTasks && (phase.status !== 'LOCKED') && (
                  <div className="text-white/20">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                )}
              </button>

              {/* Expanded tasks */}
              {isExpanded && hasTasks && phase.status !== 'LOCKED' && (
                <div className="ml-6 pl-6 border-l border-white/5 mt-1 mb-2 space-y-1">
                  {phase.tasks.map((task) => (
                    <a
                      key={task.id}
                      href={`/tasks/${task.id}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={cn(
                          'h-1.5 w-1.5 rounded-full shrink-0',
                          task.status === 'VALIDATED' && 'bg-green-400',
                          task.status === 'AVAILABLE' && 'bg-[#E50914]',
                          task.status === 'CLAIMED' && 'bg-blue-400',
                          !['VALIDATED', 'AVAILABLE', 'CLAIMED'].includes(task.status) && 'bg-white/20'
                        )} />
                        <span className="text-white/50 truncate">{task.title}</span>
                      </div>
                      <span className="text-white/20 shrink-0 ml-2">{task.priceEuros}€</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Connector line (vertical, mobile only visible) */}
              {i < phases.length - 1 && (
                <div className="h-1 w-px bg-white/[0.04] mx-auto md:hidden" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
