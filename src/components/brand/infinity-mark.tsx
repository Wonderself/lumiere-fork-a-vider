'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'

/**
 * CINEGENY brand mark — the gold film-strip infinity (∞).
 * Reused across the site as a recurring identity marker.
 */
export function InfinityMark({
  className = 'h-6 w-auto',
  animate = false,
  title = 'CINEGENY',
}: {
  className?: string
  animate?: boolean
  title?: string
}) {
  const id = useId().replace(/:/g, '')
  // Lemniscate (figure-eight) traced as two loops meeting at the center.
  const d =
    'M50 25 C 50 9, 28 9, 24 25 C 28 41, 50 41, 50 25 C 50 9, 72 9, 76 25 C 72 41, 50 41, 50 25 Z'

  return (
    <svg
      viewBox="0 0 100 50"
      className={className}
      fill="none"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="100" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9A6B1F" />
          <stop offset="35%" stopColor="#F4D35E" />
          <stop offset="55%" stopColor="#FFF3C4" />
          <stop offset="75%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9A6B1F" />
        </linearGradient>
      </defs>

      {/* Main gold stroke */}
      {animate ? (
        <motion.path
          d={d}
          stroke={`url(#gold-${id})`}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : (
        <path
          d={d}
          stroke={`url(#gold-${id})`}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Film-perforation overlay */}
      <path
        d={d}
        stroke="#0A0A0A"
        strokeWidth={1.4}
        strokeDasharray="1.5 5"
        strokeLinecap="round"
        opacity={0.55}
      />
    </svg>
  )
}

/**
 * A centered ∞ divider with gradient lines — a tasteful section break.
 */
export function InfinityDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
      <InfinityMark className="h-5 w-auto opacity-80" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
    </div>
  )
}
