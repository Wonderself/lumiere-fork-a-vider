'use client'

import { useState, useEffect } from 'react'

export function SplashScreen() {
  const [phase, setPhase] = useState<'active' | 'fading' | 'done'>('active')

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem('cinegen-splash')) {
      setPhase('done')
      return
    }
    sessionStorage.setItem('cinegen-splash', '1')

    const fadeTimer = setTimeout(() => setPhase('fading'), 2500)
    const doneTimer = setTimeout(() => setPhase('done'), 3300)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-[200] bg-black flex items-center justify-center ${
        phase === 'fading' ? 'opacity-0 scale-[1.08]' : 'opacity-100 scale-100'
      }`}
      style={{ transition: 'opacity 800ms cubic-bezier(0.4,0,0.2,1), transform 800ms cubic-bezier(0.4,0,0.2,1)' }}
    >
      {/* Ambient red glow — inner */}
      <div className="absolute w-[250px] h-[250px] rounded-full animate-[splashGlowInner_2.2s_ease-out_0.6s_both]" />
      {/* Ambient red glow — outer */}
      <div className="absolute w-[500px] h-[500px] rounded-full animate-[splashGlowOuter_2.8s_ease-out_1s_both]" />

      {/* Subtle radial rings */}
      <div className="absolute w-[160px] h-[160px] md:w-[200px] md:h-[200px] rounded-full border border-[#E50914]/0 animate-[splashRing_2s_ease-out_1.2s_both]" />
      <div className="absolute w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full border border-[#E50914]/0 animate-[splashRing_2.2s_ease-out_1.5s_both]" />

      {/* SVG Letter C — stroke draw animation */}
      <svg
        viewBox="0 0 100 100"
        className="relative w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44"
        aria-hidden="true"
      >
        <defs>
          {/* Soft glow filter */}
          <filter id="cGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Heavy glow for bg stroke */}
          <filter id="cGlowHeavy">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer 1: Wide glow stroke (draws first, blurry) */}
        <path
          d="M 74 18 A 40 40 0 1 0 74 82"
          fill="none"
          stroke="#E50914"
          strokeWidth="12"
          strokeLinecap="round"
          filter="url(#cGlowHeavy)"
          style={{ strokeDasharray: 210 }}
          className="animate-[drawC_1.8s_cubic-bezier(0.33,1,0.68,1)_0.5s_both] opacity-30"
        />

        {/* Layer 2: Main red stroke */}
        <path
          d="M 74 18 A 40 40 0 1 0 74 82"
          fill="none"
          stroke="#E50914"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#cGlow)"
          style={{ strokeDasharray: 210 }}
          className="animate-[drawC_1.8s_cubic-bezier(0.33,1,0.68,1)_0.5s_both]"
        />

        {/* Layer 3: White highlight (thinner, delayed) */}
        <path
          d="M 74 18 A 40 40 0 1 0 74 82"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ strokeDasharray: 210 }}
          className="animate-[drawC_1.6s_cubic-bezier(0.33,1,0.68,1)_0.7s_both] opacity-50"
        />

        {/* Layer 4: Bright tip dot — follows the draw with a trailing glow */}
        <circle
          r="4"
          fill="#FF4444"
          filter="url(#cGlowHeavy)"
          className="animate-[drawTip_1.8s_cubic-bezier(0.33,1,0.68,1)_0.5s_both]"
        >
          <animateMotion
            dur="1.8s"
            begin="0.5s"
            fill="freeze"
            keyTimes="0;1"
            keySplines="0.33 1 0.68 1"
            calcMode="spline"
          >
            <mpath href="#cPath" />
          </animateMotion>
        </circle>

        {/* Hidden path for motion reference */}
        <path
          id="cPath"
          d="M 74 18 A 40 40 0 1 0 74 82"
          fill="none"
          stroke="none"
        />
      </svg>

      {/* Horizontal light sweep — crosses after the C is drawn */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 h-[2px] w-[120%] animate-[lightSweep_0.8s_ease-in-out_2s_both]" />
      </div>
    </div>
  )
}
