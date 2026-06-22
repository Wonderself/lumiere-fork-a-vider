'use client'

import Link from 'next/link'
import { Pen, Vote, Trophy, Clapperboard, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const creatorActions = [
  {
    icon: Pen,
    title: 'Ecrire un Scenario',
    description: 'Soumettez votre histoire au vote de la communaute',
    href: '/community/scenarios',
    gradient: 'from-amber-500/25 via-yellow-600/15 to-amber-900/25',
    glow: 'rgba(229, 9, 20, 0.12)',
    iconBg: 'from-[#E50914] to-[#9B0000]',
    accent: '#E50914',
    bgImage: '/posters/the-rebbe.jpg',
  },
  {
    icon: Vote,
    title: 'Voter',
    description: 'Choisissez les prochains films a produire',
    href: '/community',
    gradient: 'from-blue-500/25 via-indigo-600/15 to-blue-900/25',
    glow: 'rgba(59, 130, 246, 0.12)',
    iconBg: 'from-blue-500 to-indigo-600',
    accent: '#3B82F6',
    bgImage: '/posters/esther-code.jpg',
  },
  {
    icon: Trophy,
    title: 'Concours',
    description: 'Participez aux concours de bandes-annonces',
    href: '/community/contests',
    gradient: 'from-purple-500/25 via-violet-600/15 to-purple-900/25',
    glow: 'rgba(139, 92, 246, 0.12)',
    iconBg: 'from-purple-500 to-violet-600',
    accent: '#8B5CF6',
    bgImage: '/posters/keter.jpg',
  },
  {
    icon: Clapperboard,
    title: 'Produire',
    description: 'Rejoignez la production via des micro-taches',
    href: '/tasks',
    gradient: 'from-emerald-500/25 via-green-600/15 to-emerald-900/25',
    glow: 'rgba(16, 185, 129, 0.12)',
    iconBg: 'from-emerald-500 to-green-600',
    accent: '#10B981',
    bgImage: '/posters/miracle-protocol.jpg',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export function CreatorBar() {
  return (
    <section className="px-6 sm:px-10 md:px-16 lg:px-20 mb-20 mt-6">
      {/* Section header */}
      <div className="flex items-center gap-5 mb-10">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#E50914] to-[#9B0000] flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.2)]">
          <Sparkles className="h-4.5 w-4.5 text-black" />
        </div>
        <div>
          <h2
            className="text-xl md:text-2xl font-bold text-white tracking-tight"
          >
            Participez a la Creation
          </h2>
          <p className="text-[11px] text-white/35 mt-1.5 tracking-wide">Devenez acteur du cinema de demain</p>
        </div>
      </div>

      {/* Cards grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {creatorActions.map((action) => (
          <motion.div key={action.title} variants={cardVariants}>
            <Link
              href={action.href}
              className="group relative block rounded-2xl overflow-hidden h-[215px] sm:h-[235px] md:h-[255px]"
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${action.bgImage})` }}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/70 group-hover:bg-black/55 transition-colors duration-500" />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${action.gradient} opacity-80`} />

              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ boxShadow: `inset 0 0 80px ${action.glow}` }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${action.accent}, transparent)` }}
              />

              {/* Content — perfect padding */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-7 md:p-8">
                {/* Icon */}
                <div
                  className={`h-12 w-12 rounded-xl bg-gradient-to-br ${action.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300`}
                >
                  <action.icon className="h-5 w-5 text-white" />
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-white transition-colors leading-tight"
                  >
                    {action.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-white/45 group-hover:text-white/65 leading-relaxed transition-colors line-clamp-2">
                    {action.description}
                  </p>

                  {/* CTA arrow */}
                  <div className="flex items-center gap-2 mt-3.5 text-xs font-semibold transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                    style={{ color: action.accent }}
                  >
                    <span>Explorer</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Bottom border glow */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${action.accent}, transparent)` }}
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
