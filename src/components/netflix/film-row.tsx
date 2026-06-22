'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, Eye, Film, Vote } from 'lucide-react'

interface FilmCard {
  id: string
  title: string
  slug: string
  genre: string | null
  coverImageUrl: string | null
  status: string
  progressPct: number
  fundingPct?: number
  type: 'film' | 'catalog'
}

interface FilmRowProps {
  title: string
  films: FilmCard[]
  href?: string
  variant?: 'default' | 'trending'
}

/* ── Genre color map for gradient posters ── */
const GENRE_COLORS: Record<string, [string, string]> = {
  'Action':      ['#E50914', '#FF4444'],
  'Comedy':      ['#F59E0B', '#FCD34D'],
  'Drama':       ['#8B5CF6', '#C4B5FD'],
  'Sci-Fi':      ['#3B82F6', '#93C5FD'],
  'Documentary': ['#10B981', '#6EE7B7'],
  'Thriller':    ['#6366F1', '#A5B4FC'],
  'Animation':   ['#EC4899', '#F9A8D4'],
  'Historical':  ['#D97706', '#FCD34D'],
  'Romance':     ['#F43F5E', '#FDA4AF'],
  'Fantasy':     ['#A855F7', '#D8B4FE'],
}

/* Deterministic hash for unique gradient angles/patterns */
function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/* ── SVG Poster Component ── */
function SvgPoster({ title, genre }: { title: string; genre: string | null }) {
  const [c1, c2] = GENRE_COLORS[genre || ''] || ['#333', '#555']
  const h = hashStr(title)
  const angle = h % 360
  const offset1 = (h % 30) - 15
  const offset2 = ((h >> 4) % 20) - 10
  const offset3 = ((h >> 8) % 25) - 12
  const scale = 0.85 + ((h % 30) / 100)
  const uid = `p${h % 99999}`
  const g = genre || ''

  const genreElements = (): React.ReactNode => {
    switch (g) {
      case 'Action':
        return (
          <>
            {/* Diagonal slash */}
            <line x1={-10 + offset1} y1={-10} x2={210 + offset1} y2={310} stroke={c1} strokeWidth="40" opacity="0.15" />
            <line x1={30 + offset2} y1={-10} x2={250 + offset2} y2={310} stroke={c2} strokeWidth="2" opacity="0.4" />
            <line x1={20 + offset2} y1={-10} x2={240 + offset2} y2={310} stroke={c1} strokeWidth="1" opacity="0.3" />
            {/* Angular shapes */}
            <polygon points={`${40 + offset1},${60 + offset2} ${80 + offset1},${30 + offset2} ${120 + offset1},${60 + offset2} ${80 + offset1},${90 + offset2}`} fill="none" stroke={c2} strokeWidth="1" opacity="0.25" />
            <polygon points={`${130 + offset2},${100 + offset1} ${160 + offset2},${80 + offset1} ${190 + offset2},${100 + offset1} ${160 + offset2},${120 + offset1}`} fill="none" stroke={c1} strokeWidth="0.8" opacity="0.2" />
            {/* Crosshair at center */}
            <circle cx={100 + offset1 * 0.3} cy={140 + offset2 * 0.3} r="25" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.3" />
            <circle cx={100 + offset1 * 0.3} cy={140 + offset2 * 0.3} r="12" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" />
            <circle cx={100 + offset1 * 0.3} cy={140 + offset2 * 0.3} r="3" fill={c1} opacity="0.5" />
            <line x1={100 + offset1 * 0.3} y1={110 + offset2 * 0.3} x2={100 + offset1 * 0.3} y2={130 + offset2 * 0.3} stroke={c2} strokeWidth="1" opacity="0.35" />
            <line x1={100 + offset1 * 0.3} y1={150 + offset2 * 0.3} x2={100 + offset1 * 0.3} y2={170 + offset2 * 0.3} stroke={c2} strokeWidth="1" opacity="0.35" />
            <line x1={70 + offset1 * 0.3} y1={140 + offset2 * 0.3} x2={90 + offset1 * 0.3} y2={140 + offset2 * 0.3} stroke={c2} strokeWidth="1" opacity="0.35" />
            <line x1={110 + offset1 * 0.3} y1={140 + offset2 * 0.3} x2={130 + offset1 * 0.3} y2={140 + offset2 * 0.3} stroke={c2} strokeWidth="1" opacity="0.35" />
            {/* Harsh angular bars */}
            <rect x="0" y={185 + offset3} width="200" height="2" fill={c1} opacity="0.2" />
            <rect x="0" y={195 + offset3} width="200" height="1" fill={c2} opacity="0.15" />
          </>
        )

      case 'Comedy':
        return (
          <>
            {/* Spotlight from top */}
            <ellipse cx={100 + offset1} cy={-20} rx="80" ry="30" fill={`url(#${uid}_spot)`} opacity="0.3" />
            <defs>
              <radialGradient id={`${uid}_spot`} cx="50%" cy="0%" r="100%">
                <stop offset="0%" stopColor={c2} stopOpacity="0.6" />
                <stop offset="100%" stopColor={c2} stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Spotlight cone */}
            <polygon points={`${100 + offset1},-10 ${40 + offset1},200 ${160 + offset1},200`} fill={c2} opacity="0.04" />
            <polygon points={`${100 + offset1},-10 ${60 + offset1},160 ${140 + offset1},160`} fill={c2} opacity="0.06" />
            {/* Confetti dots */}
            {Array.from({ length: 18 }, (_, i) => {
              const cx = ((h + i * 37) % 180) + 10
              const cy = ((h + i * 53) % 220) + 20
              const r = 1.5 + ((h + i * 7) % 3)
              const rot = (h + i * 41) % 360
              const colors = [c1, c2, '#FFFFFF', c1, c2]
              return (
                <g key={i} transform={`rotate(${rot} ${cx} ${cy})`}>
                  <rect x={cx - r} y={cy - r * 0.4} width={r * 2} height={r * 0.8} rx="0.5" fill={colors[i % colors.length]} opacity={0.15 + (i % 4) * 0.08} />
                </g>
              )
            })}
            {/* Warm circles */}
            <circle cx={50 + offset2} cy={80 + offset1} r="20" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.2" />
            <circle cx={150 + offset1} cy={120 + offset2} r="15" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.15" />
          </>
        )

      case 'Drama':
        return (
          <>
            {/* Theater curtain drapes */}
            <path d={`M0,0 Q${50 + offset1},${80 + offset2} 0,${160 + offset3}`} fill="none" stroke={c1} strokeWidth="2" opacity="0.2" />
            <path d={`M0,0 Q${60 + offset1},${90 + offset2} 0,${180 + offset3}`} fill="none" stroke={c2} strokeWidth="1" opacity="0.15" />
            <path d={`M200,0 Q${150 + offset1},${80 + offset2} 200,${160 + offset3}`} fill="none" stroke={c1} strokeWidth="2" opacity="0.2" />
            <path d={`M200,0 Q${140 + offset1},${90 + offset2} 200,${180 + offset3}`} fill="none" stroke={c2} strokeWidth="1" opacity="0.15" />
            {/* Curtain fill */}
            <path d={`M0,0 Q${55 + offset1},${85 + offset2} 0,${170 + offset3} L0,0Z`} fill={c1} opacity="0.06" />
            <path d={`M200,0 Q${145 + offset1},${85 + offset2} 200,${170 + offset3} L200,0Z`} fill={c1} opacity="0.06" />
            {/* Elegant horizontal lines */}
            <line x1="30" y1={100 + offset2} x2="170" y2={100 + offset2} stroke={c2} strokeWidth="0.5" opacity="0.15" />
            <line x1="50" y1={110 + offset2} x2="150" y2={110 + offset2} stroke={c2} strokeWidth="0.3" opacity="0.1" />
            {/* Decorative diamond */}
            <polygon points={`100,${70 + offset2} ${112 + offset1 * 0.2},${85 + offset2} 100,${100 + offset2} ${88 + offset1 * 0.2},${85 + offset2}`} fill="none" stroke={c2} strokeWidth="0.8" opacity="0.2" />
            {/* Subtle drape swags at top */}
            <path d={`M0,${8 + offset3 * 0.2} Q50,${25 + offset3 * 0.3} 100,${8 + offset3 * 0.2} Q150,${25 + offset3 * 0.3} 200,${8 + offset3 * 0.2}`} fill="none" stroke={c1} strokeWidth="1.5" opacity="0.15" />
          </>
        )

      case 'Sci-Fi':
        return (
          <>
            {/* Circuit grid lines */}
            {Array.from({ length: 6 }, (_, i) => {
              const y = 30 + i * 45 + (offset1 * 0.3)
              return <line key={`h${i}`} x1="0" y1={y} x2="200" y2={y} stroke={c2} strokeWidth="0.3" opacity="0.12" />
            })}
            {Array.from({ length: 5 }, (_, i) => {
              const x = 25 + i * 40 + (offset2 * 0.3)
              return <line key={`v${i}`} x1={x} y1="0" x2={x} y2="300" stroke={c2} strokeWidth="0.3" opacity="0.12" />
            })}
            {/* Glowing node dots at intersections */}
            {Array.from({ length: 8 }, (_, i) => {
              const nx = ((h + i * 43) % 160) + 20
              const ny = ((h + i * 67) % 240) + 20
              return (
                <g key={`n${i}`}>
                  <circle cx={nx} cy={ny} r="4" fill={c2} opacity="0.08" />
                  <circle cx={nx} cy={ny} r="1.5" fill={c2} opacity="0.35" />
                </g>
              )
            })}
            {/* Hexagonal shape */}
            <polygon points={`${100 + offset1 * 0.5},${100 + offset2 * 0.5} ${120 + offset1 * 0.5},${112 + offset2 * 0.5} ${120 + offset1 * 0.5},${135 + offset2 * 0.5} ${100 + offset1 * 0.5},${147 + offset2 * 0.5} ${80 + offset1 * 0.5},${135 + offset2 * 0.5} ${80 + offset1 * 0.5},${112 + offset2 * 0.5}`} fill="none" stroke={c1} strokeWidth="1" opacity="0.25" />
            <polygon points={`${100 + offset1 * 0.5},${107 + offset2 * 0.5} ${114 + offset1 * 0.5},${116 + offset2 * 0.5} ${114 + offset1 * 0.5},${131 + offset2 * 0.5} ${100 + offset1 * 0.5},${140 + offset2 * 0.5} ${86 + offset1 * 0.5},${131 + offset2 * 0.5} ${86 + offset1 * 0.5},${116 + offset2 * 0.5}`} fill="none" stroke={c2} strokeWidth="0.5" opacity="0.18" />
            {/* Neon scan line */}
            <rect x="0" y={150 + offset3} width="200" height="1" fill={c2} opacity="0.2" />
            <rect x="0" y={150 + offset3} width="200" height="4" fill={c2} opacity="0.04" />
          </>
        )

      case 'Documentary':
        return (
          <>
            {/* Camera lens aperture circles */}
            <circle cx={100 + offset1 * 0.4} cy={130 + offset2 * 0.4} r="50" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.15" />
            <circle cx={100 + offset1 * 0.4} cy={130 + offset2 * 0.4} r="35" fill="none" stroke={c2} strokeWidth="1" opacity="0.2" />
            <circle cx={100 + offset1 * 0.4} cy={130 + offset2 * 0.4} r="20" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.25" />
            <circle cx={100 + offset1 * 0.4} cy={130 + offset2 * 0.4} r="8" fill={c1} opacity="0.1" />
            {/* Aperture blades */}
            {Array.from({ length: 6 }, (_, i) => {
              const a = (i * 60 + angle * 0.5) * Math.PI / 180
              const cx0 = 100 + offset1 * 0.4
              const cy0 = 130 + offset2 * 0.4
              const x1 = cx0 + Math.cos(a) * 22
              const y1 = cy0 + Math.sin(a) * 22
              const x2 = cx0 + Math.cos(a) * 48
              const y2 = cy0 + Math.sin(a) * 48
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c2} strokeWidth="0.8" opacity="0.18" />
            })}
            {/* Clean geometric lines */}
            <line x1="20" y1={60 + offset3} x2="180" y2={60 + offset3} stroke={c2} strokeWidth="0.4" opacity="0.15" />
            <line x1="20" y1={200 + offset3} x2="180" y2={200 + offset3} stroke={c2} strokeWidth="0.4" opacity="0.15" />
            {/* Earth tone overlay rect */}
            <rect x="10" y={55 + offset3} width="180" height={150} rx="2" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.12" />
          </>
        )

      case 'Thriller':
        return (
          <>
            {/* Shattered glass cracks from center */}
            {Array.from({ length: 10 }, (_, i) => {
              const a = ((h + i * 36) % 360) * Math.PI / 180
              const cx0 = 100 + offset1 * 0.3
              const cy0 = 140 + offset2 * 0.3
              const len = 40 + ((h + i * 23) % 60)
              const midX = cx0 + Math.cos(a) * len * 0.5 + ((h + i * 11) % 10 - 5)
              const midY = cy0 + Math.sin(a) * len * 0.5 + ((h + i * 13) % 10 - 5)
              const endX = cx0 + Math.cos(a) * len
              const endY = cy0 + Math.sin(a) * len
              return (
                <g key={i}>
                  <path d={`M${cx0},${cy0} L${midX},${midY} L${endX},${endY}`} fill="none" stroke={c2} strokeWidth={0.5 + (i % 3) * 0.3} opacity={0.15 + (i % 4) * 0.05} />
                  {i % 3 === 0 && (
                    <path d={`M${midX},${midY} L${midX + ((h + i) % 15) - 7},${midY + ((h + i * 3) % 15) - 7}`} fill="none" stroke={c1} strokeWidth="0.4" opacity="0.12" />
                  )}
                </g>
              )
            })}
            {/* Central dark point */}
            <circle cx={100 + offset1 * 0.3} cy={140 + offset2 * 0.3} r="5" fill={c1} opacity="0.15" />
            <circle cx={100 + offset1 * 0.3} cy={140 + offset2 * 0.3} r="2" fill={c2} opacity="0.3" />
            {/* Dark mysterious fog */}
            <ellipse cx="100" cy="280" rx="120" ry="40" fill={c1} opacity="0.06" />
          </>
        )

      case 'Animation':
        return (
          <>
            {/* Scattered stars */}
            {Array.from({ length: 12 }, (_, i) => {
              const sx = ((h + i * 41) % 180) + 10
              const sy = ((h + i * 59) % 240) + 15
              const sr = 2 + ((h + i * 7) % 3)
              const colors = [c1, c2, '#FFFFFF', c2, c1]
              return (
                <g key={i} opacity={0.15 + (i % 5) * 0.07}>
                  {/* 4-point star */}
                  <path d={`M${sx},${sy - sr} L${sx + sr * 0.3},${sy - sr * 0.3} L${sx + sr},${sy} L${sx + sr * 0.3},${sy + sr * 0.3} L${sx},${sy + sr} L${sx - sr * 0.3},${sy + sr * 0.3} L${sx - sr},${sy} L${sx - sr * 0.3},${sy - sr * 0.3}Z`} fill={colors[i % colors.length]} />
                </g>
              )
            })}
            {/* Sparkle bursts */}
            {Array.from({ length: 4 }, (_, i) => {
              const bx = ((h + i * 73) % 140) + 30
              const by = ((h + i * 47) % 180) + 30
              return (
                <g key={`b${i}`} opacity="0.2">
                  <line x1={bx} y1={by - 6} x2={bx} y2={by + 6} stroke={c2} strokeWidth="0.8" />
                  <line x1={bx - 6} y1={by} x2={bx + 6} y2={by} stroke={c2} strokeWidth="0.8" />
                  <line x1={bx - 4} y1={by - 4} x2={bx + 4} y2={by + 4} stroke={c2} strokeWidth="0.5" />
                  <line x1={bx + 4} y1={by - 4} x2={bx - 4} y2={by + 4} stroke={c2} strokeWidth="0.5" />
                </g>
              )
            })}
            {/* Magical wand trail */}
            <path d={`M${30 + offset1},${50 + offset2} Q${80 + offset2},${30 + offset1} ${130 + offset1},${60 + offset2} Q${160 + offset2},${80 + offset1} ${180 + offset1},${50 + offset2}`} fill="none" stroke={c2} strokeWidth="1" opacity="0.15" strokeDasharray="4 3" />
          </>
        )

      case 'Historical':
        return (
          <>
            {/* Ornate border frame */}
            <rect x="12" y="12" width="176" height="276" rx="3" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.2" />
            <rect x="18" y="18" width="164" height="264" rx="2" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.15" />
            {/* Corner ornaments */}
            {[{ x: 12, y: 12 }, { x: 188, y: 12 }, { x: 12, y: 288 }, { x: 188, y: 288 }].map((corner, i) => (
              <g key={i}>
                <circle cx={corner.x} cy={corner.y} r="6" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.25" />
                <circle cx={corner.x} cy={corner.y} r="2.5" fill={c1} opacity="0.15" />
              </g>
            ))}
            {/* Compass rose */}
            <g transform={`translate(${100 + offset1 * 0.3},${120 + offset2 * 0.3}) rotate(${angle * 0.2})`} opacity="0.2">
              <polygon points="0,-20 4,-4 0,-8 -4,-4" fill={c2} />
              <polygon points="0,20 4,4 0,8 -4,4" fill={c1} />
              <polygon points="-20,0 -4,-4 -8,0 -4,4" fill={c2} />
              <polygon points="20,0 4,-4 8,0 4,4" fill={c1} />
              <circle cx="0" cy="0" r="3" fill="none" stroke={c2} strokeWidth="0.8" />
            </g>
            {/* Aged parchment lines */}
            <line x1="30" y1={190 + offset3 * 0.3} x2="170" y2={190 + offset3 * 0.3} stroke={c2} strokeWidth="0.3" opacity="0.12" />
            <line x1="40" y1={200 + offset3 * 0.3} x2="160" y2={200 + offset3 * 0.3} stroke={c2} strokeWidth="0.3" opacity="0.08" />
          </>
        )

      case 'Romance':
        return (
          <>
            {/* Flowing heart curves */}
            <path d={`M${100 + offset1 * 0.3},${100 + offset2 * 0.5} C${100 + offset1 * 0.3},${85 + offset2 * 0.5} ${75 + offset1 * 0.3},${70 + offset2 * 0.5} ${70 + offset1 * 0.3},${85 + offset2 * 0.5} C${65 + offset1 * 0.3},${110 + offset2 * 0.5} ${100 + offset1 * 0.3},${130 + offset2 * 0.5} ${100 + offset1 * 0.3},${130 + offset2 * 0.5} C${100 + offset1 * 0.3},${130 + offset2 * 0.5} ${135 + offset1 * 0.3},${110 + offset2 * 0.5} ${130 + offset1 * 0.3},${85 + offset2 * 0.5} C${125 + offset1 * 0.3},${70 + offset2 * 0.5} ${100 + offset1 * 0.3},${85 + offset2 * 0.5} ${100 + offset1 * 0.3},${100 + offset2 * 0.5}Z`} fill={c1} opacity="0.08" stroke={c2} strokeWidth="0.8" />
            {/* Smaller floating hearts */}
            {Array.from({ length: 5 }, (_, i) => {
              const hx = ((h + i * 47) % 150) + 25
              const hy = ((h + i * 61) % 200) + 25
              const hs = 4 + (i % 3) * 2
              return (
                <path key={i} d={`M${hx},${hy} C${hx},${hy - hs * 0.4} ${hx - hs},${hy - hs * 0.6} ${hx - hs},${hy} C${hx - hs},${hy + hs * 0.6} ${hx},${hy + hs} ${hx},${hy + hs} C${hx},${hy + hs} ${hx + hs},${hy + hs * 0.6} ${hx + hs},${hy} C${hx + hs},${hy - hs * 0.6} ${hx},${hy - hs * 0.4} ${hx},${hy}Z`} fill={c1} opacity={0.06 + i * 0.02} />
              )
            })}
            {/* Intertwined ribbons */}
            <path d={`M${20 + offset1},${160 + offset2 * 0.3} Q${60 + offset2},${140 + offset1 * 0.3} ${100 + offset1},${160 + offset2 * 0.3} Q${140 + offset2},${180 + offset1 * 0.3} ${180 + offset1},${160 + offset2 * 0.3}`} fill="none" stroke={c2} strokeWidth="1" opacity="0.15" />
            <path d={`M${20 + offset1},${168 + offset2 * 0.3} Q${60 + offset2},${188 + offset1 * 0.3} ${100 + offset1},${168 + offset2 * 0.3} Q${140 + offset2},${148 + offset1 * 0.3} ${180 + offset1},${168 + offset2 * 0.3}`} fill="none" stroke={c1} strokeWidth="1" opacity="0.15" />
            {/* Soft gradient circle */}
            <circle cx={100 + offset1 * 0.2} cy={100 + offset2 * 0.3} r="60" fill={`url(#${uid}_rose)`} opacity="0.06" />
            <defs>
              <radialGradient id={`${uid}_rose`}>
                <stop offset="0%" stopColor={c1} />
                <stop offset="100%" stopColor={c1} stopOpacity="0" />
              </radialGradient>
            </defs>
          </>
        )

      case 'Fantasy':
        return (
          <>
            {/* Crystal formation */}
            <polygon points={`${100 + offset1 * 0.3},${70 + offset2 * 0.3} ${115 + offset1 * 0.3},${120 + offset2 * 0.3} ${100 + offset1 * 0.3},${160 + offset2 * 0.3} ${85 + offset1 * 0.3},${120 + offset2 * 0.3}`} fill={c1} opacity="0.06" stroke={c2} strokeWidth="0.8" strokeOpacity="0.25" />
            <polygon points={`${100 + offset1 * 0.3},${80 + offset2 * 0.3} ${110 + offset1 * 0.3},${118 + offset2 * 0.3} ${100 + offset1 * 0.3},${150 + offset2 * 0.3} ${90 + offset1 * 0.3},${118 + offset2 * 0.3}`} fill="none" stroke={c1} strokeWidth="0.5" opacity="0.2" />
            {/* Side crystals */}
            <polygon points={`${60 + offset2 * 0.3},${100 + offset1 * 0.2} ${68 + offset2 * 0.3},${130 + offset1 * 0.2} ${55 + offset2 * 0.3},${140 + offset1 * 0.2} ${52 + offset2 * 0.3},${115 + offset1 * 0.2}`} fill={c2} opacity="0.05" stroke={c2} strokeWidth="0.5" strokeOpacity="0.15" />
            <polygon points={`${140 + offset2 * 0.3},${95 + offset1 * 0.2} ${150 + offset2 * 0.3},${125 + offset1 * 0.2} ${145 + offset2 * 0.3},${145 + offset1 * 0.2} ${135 + offset2 * 0.3},${110 + offset1 * 0.2}`} fill={c2} opacity="0.05" stroke={c1} strokeWidth="0.5" strokeOpacity="0.15" />
            {/* Scattered stars */}
            {Array.from({ length: 10 }, (_, i) => {
              const sx = ((h + i * 37) % 180) + 10
              const sy = ((h + i * 53) % 200) + 20
              const sr = 1 + ((h + i) % 2)
              return <circle key={i} cx={sx} cy={sy} r={sr} fill={c2} opacity={0.1 + (i % 4) * 0.06} />
            })}
            {/* Mystical fog/mist layers */}
            <ellipse cx="100" cy={220 + offset3 * 0.3} rx="90" ry="20" fill={c1} opacity="0.05" />
            <ellipse cx={80 + offset1 * 0.2} cy={240 + offset3 * 0.3} rx="70" ry="15" fill={c2} opacity="0.04" />
            <ellipse cx={120 + offset2 * 0.2} cy={255 + offset3 * 0.3} rx="80" ry="12" fill={c1} opacity="0.03" />
          </>
        )

      default:
        return (
          <>
            {/* Default: subtle geometric */}
            <circle cx={100 + offset1} cy={130 + offset2} r="40" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.15" />
            <circle cx={100 + offset1} cy={130 + offset2} r="60" fill="none" stroke={c2} strokeWidth="0.4" opacity="0.1" />
            <line x1="20" y1={180 + offset3} x2="180" y2={180 + offset3} stroke={c2} strokeWidth="0.3" opacity="0.12" />
          </>
        )
    }
  }

  return (
    <div className="absolute inset-0 transition-transform duration-700 group-hover/card:scale-[1.06]">
      <svg viewBox="0 0 200 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Background gradient */}
          <linearGradient id={`${uid}_bg`} x1="0%" y1="0%" x2={`${50 + (angle % 50)}%`} y2="100%">
            <stop offset="0%" stopColor="#0A0A0A" />
            <stop offset={`${30 + (h % 30)}%`} stopColor={c1} stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0A0A0A" />
          </linearGradient>
          {/* Film grain filter */}
          <filter id={`${uid}_grain`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
            <feBlend in="SourceGraphic" in2="mono" mode="multiply" />
          </filter>
        </defs>

        {/* Base background */}
        <rect width="200" height="300" fill={`url(#${uid}_bg)`} />

        {/* Genre-specific decorative elements */}
        <g transform={`scale(${scale}) translate(${(1 - scale) * 100},${(1 - scale) * 150})`}>
          {genreElements()}
        </g>

        {/* Film grain texture overlay */}
        <rect width="200" height="300" opacity="0.12" filter={`url(#${uid}_grain)`} fill="transparent" />

      </svg>
    </div>
  )
}

/* ── Status helpers ── */
function getStatusBadge(status: string): { label: string; color: string; icon: typeof Eye } | null {
  switch (status) {
    case 'RELEASED':
    case 'LIVE':
      return { label: 'Watch Now', color: '#10B981', icon: Eye }
    case 'POST_PRODUCTION':
    case 'IN_PRODUCTION':
      return { label: 'Trailer', color: '#E50914', icon: Film }
    case 'PRE_PRODUCTION':
    case 'DRAFT':
      return { label: 'Vote', color: '#F59E0B', icon: Vote }
    default:
      return null
  }
}

/* Status badge labels */
const STATUS_SHORT: Record<string, string> = {
  DRAFT: 'Dev',
  PRE_PRODUCTION: 'Pre-prod',
  IN_PRODUCTION: 'Prod',
  POST_PRODUCTION: 'Post-prod',
  RELEASED: 'Released',
}

export function FilmRow({ title, films, href, variant = 'default' }: FilmRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const updateArrows = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setShowLeft(scrollLeft > 20)
    setShowRight(scrollLeft < scrollWidth - clientWidth - 20)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  if (films.length === 0) return null

  return (
    <section className="relative group/row mb-8 md:mb-10">
      {/* Row title */}
      <div className="flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-20 mb-3.5">
        <h2 className="text-base md:text-lg lg:text-xl font-bold text-white/90 tracking-tight section-title-flash">
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="text-xs text-[#E50914]/70 hover:text-[#E50914] transition-colors font-medium tracking-wide group/link flex items-center gap-1"
          >
            View All
            <ChevronRight className="h-3.5 w-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Scroll container */}
      <div className="relative">
        {showLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-14 md:w-16 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent flex items-center justify-start pl-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
          >
            <div className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 hover:border-[#E50914]/30 transition-all">
              <ChevronLeft className="h-4 w-4 text-white/80" />
            </div>
          </button>
        )}

        {showRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-14 md:w-16 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent flex items-center justify-end pr-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
          >
            <div className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-black/80 hover:border-[#E50914]/30 transition-all">
              <ChevronRight className="h-4 w-4 text-white/80" />
            </div>
          </button>
        )}

        {/* Films scroll */}
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          className="flex items-start gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-8 md:px-16 lg:px-20 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {films.map((film) => {
            const fundingPct = film.fundingPct ?? ((hashStr(film.id) % 60) + 20)
            const badge = getStatusBadge(film.status)
            const hasImage = !!film.coverImageUrl
            const genreColor = GENRE_COLORS[film.genre || ''] || ['#E50914', '#FF4444']

            return (
              <Link
                key={film.id}
                href={film.type === 'catalog' ? `/streaming/${film.slug}` : `/films/${film.slug}`}
                className="group/card flex-shrink-0 snap-start w-[140px] sm:w-[160px] md:w-[190px] lg:w-[210px] relative transition-all duration-300 hover:scale-[1.05] hover:z-20"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] bg-[#141414] rounded-xl overflow-hidden ring-1 ring-white/5 group-hover/card:ring-[#E50914]/30 transition-all duration-300 group-hover/card:shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
                  {hasImage ? (
                    <Image
                      src={film.coverImageUrl!}
                      alt={film.title}
                      fill
                      loading="lazy"
                      className="object-cover transition-transform duration-700 group-hover/card:scale-[1.06]"
                      sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, (max-width: 1024px) 190px, 210px"
                    />
                  ) : (
                    <SvgPoster title={film.title} genre={film.genre} />
                  )}

                  {/* Cinematic vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

                  {/* Poster overlay: discreet logo + genre + status */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Logo — top center, very discreet */}
                    <div className="absolute top-1.5 left-0 right-0 flex justify-center">
                      <span className="text-[6px] font-black tracking-[0.2em] text-white/30 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                        CINE<span style={{ color: `${genreColor[0]}80` }}>GEN</span>
                      </span>
                    </div>

                    {/* Genre badge — top right, small */}
                    {film.genre && (
                      <span
                        className="absolute top-1.5 right-1.5 text-[5px] font-bold uppercase tracking-wider px-1 py-0.5 rounded backdrop-blur-sm"
                        style={{ background: `${genreColor[0]}60`, color: 'rgba(255,255,255,0.8)' }}
                      >
                        {film.genre}
                      </span>
                    )}

                    {/* Status — bottom left, discreet */}
                    <span
                      className="absolute bottom-1.5 left-1.5 text-[5px] font-semibold uppercase tracking-wider px-1 py-0.5 rounded bg-black/50 backdrop-blur-sm text-white/50"
                    >
                      {STATUS_SHORT[film.status] || film.status}
                    </span>
                  </div>

                  {/* Hover overlay — play button + expanded info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 group-hover/card:scale-100 scale-75">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(229,9,20,0.5)]" style={{ background: 'linear-gradient(135deg, #E50914, #FF2D2D)' }}>
                        <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    <p className="text-[12px] font-bold text-white leading-tight">{film.title}</p>
                    <p className="text-[10px] text-white/50 mt-0.5">{film.genre}</p>
                  </div>

                  {/* Status badge (top-left) */}
                  {badge && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span
                        className="flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded text-white uppercase tracking-wider backdrop-blur-sm"
                        style={{ background: `${badge.color}CC` }}
                      >
                        <badge.icon className="h-2.5 w-2.5" />
                        {badge.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info below poster — fixed height for uniform cards */}
                <div className="pt-2.5 px-0.5 h-[76px]">
                  <p className="text-[11px] sm:text-[12px] font-semibold text-white/80 truncate group-hover/card:text-white transition-colors">{film.title}</p>

                  {/* Dual progress bars */}
                  <div className="mt-1.5 space-y-1">
                    {/* Funding bar (green) */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-white/25 uppercase tracking-wider">Funded</span>
                        <span className="text-[8px] font-bold text-emerald-400">{fundingPct}%</span>
                      </div>
                      <div className="h-[2px] bg-white/[0.06] rounded-full overflow-hidden mt-px">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(fundingPct, 100)}%`,
                            background: 'linear-gradient(90deg, #059669, #10B981)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Production bar (red) */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-white/25 uppercase tracking-wider">Progress</span>
                        <span className="text-[8px] font-bold text-[#E50914]">{film.progressPct}%</span>
                      </div>
                      <div className="h-[2px] bg-white/[0.06] rounded-full overflow-hidden mt-px">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${film.progressPct}%`,
                            background: 'linear-gradient(90deg, #B20710, #E50914)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
