'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lock, Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CREATE_STEPS } from './create-steps'

/**
 * Shared layout for /create/* sub-pages.
 * Shows a horizontal stepper at the top and wraps children.
 * Steps are viewable but functionality is locked until previous step is validated.
 */

interface CreateLayoutProps {
  children: React.ReactNode
  currentStepId: string
  /** Which steps the user has completed (persisted in localStorage) */
  completedSteps: string[]
  onMarkComplete?: () => void
}

export function CreateLayout({ children, currentStepId, completedSteps, onMarkComplete }: CreateLayoutProps) {
  const pathname = usePathname()

  const currentIndex = CREATE_STEPS.findIndex((s) => s.id === currentStepId)

  function isStepUnlocked(stepId: string) {
    const stepIndex = CREATE_STEPS.findIndex((s) => s.id === stepId)
    if (stepIndex === 0) return true
    // All previous steps must be completed
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.includes(CREATE_STEPS[i].id)) return false
    }
    return true
  }

  const currentUnlocked = isStepUnlocked(currentStepId)
  const currentCompleted = completedSteps.includes(currentStepId)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Stepper navigation */}
      <div className="border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-14 md:top-[56px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
            <Link
              href="/create"
              className="text-[10px] text-white/30 hover:text-white/60 transition-colors shrink-0"
            >
              Create
            </Link>
            <ChevronRight className="h-3 w-3 text-white/15 shrink-0" />

            {CREATE_STEPS.map((step, i) => {
              const isActive = step.id === currentStepId
              const isCompleted = completedSteps.includes(step.id)
              const isLocked = !isStepUnlocked(step.id)

              return (
                <div key={step.id} className="flex items-center shrink-0">
                  <Link
                    href={step.href}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[#E50914]/15 text-[#E50914]'
                        : isCompleted
                          ? 'text-emerald-400/70 hover:text-emerald-400'
                          : isLocked
                            ? 'text-white/20 hover:text-white/30'
                            : 'text-white/40 hover:text-white/60'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : isLocked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[8px]">
                        {step.number}
                      </span>
                    )}
                    <span className="hidden sm:inline">{step.shortTitle}</span>
                    <span className="sm:hidden">{step.number}</span>
                  </Link>
                  {i < CREATE_STEPS.length - 1 && (
                    <div className={cn(
                      'w-4 h-px mx-0.5',
                      isCompleted ? 'bg-emerald-400/30' : 'bg-white/[0.06]'
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}

        {/* Mark as complete / locked banner */}
        {!currentUnlocked && (
          <div className="mt-8 p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 text-center">
            <Lock className="h-8 w-8 text-amber-500/60 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white/90 mb-2">Step Locked</h3>
            <p className="text-sm text-white/50 max-w-md mx-auto">
              Complete the previous steps to unlock this step&apos;s features.
              You can browse this page but cannot use the tools yet.
            </p>
            <Link
              href={CREATE_STEPS[currentIndex - 1]?.href || '/create'}
              className="inline-block mt-4 px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#E50914] hover:bg-[#B20710] transition-colors"
            >
              Go to Step {currentIndex}: {CREATE_STEPS[currentIndex - 1]?.shortTitle}
            </Link>
          </div>
        )}

        {currentUnlocked && !currentCompleted && onMarkComplete && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onMarkComplete}
              className="group relative px-8 py-3 rounded-lg text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Mark Step as Complete
              </span>
              {/* Animated golden border */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: 'linear-gradient(135deg, transparent, rgba(196,160,48,0.3), transparent)',
                animation: 'borderGlow 2s ease-in-out infinite',
              }} />
            </button>
          </div>
        )}

        {currentCompleted && (
          <div className="mt-8 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">Step completed</span>
            </div>
            {currentIndex < CREATE_STEPS.length - 1 && (
              <Link
                href={CREATE_STEPS[currentIndex + 1].href}
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#E50914] hover:text-[#FF2D2D] transition-colors"
              >
                Continue to {CREATE_STEPS[currentIndex + 1].shortTitle}
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
