'use client'

import Link from 'next/link'
import { Pen, Users, Award, TrendingUp, ArrowRight, Star, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const benefits = [
  {
    icon: Pen,
    label: 'Ecrivez',
    description: 'Soumettez votre scenario original',
  },
  {
    icon: Users,
    label: 'Communaute',
    description: 'Le public vote pour ses favoris',
  },
  {
    icon: Award,
    label: 'Production',
    description: 'Les gagnants sont produits en film',
  },
  {
    icon: Shield,
    label: 'Blockchain',
    description: 'Credits et droits garantis on-chain',
  },
]

export function ScreenwriterCTA() {
  return (
    <section className="relative mx-4 sm:mx-8 md:mx-16 lg:mx-20 mb-20 overflow-hidden rounded-2xl">
      {/* Background — cinematic dark with gold accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-[#1A0808] to-[#0F0F0F]" />
      <div className="absolute inset-0 bg-[url('/posters/the-rebbe.jpg')] bg-cover bg-center opacity-[0.06]" />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent" />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#E50914]/10 to-transparent" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-[#E50914]/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-10 md:px-14 lg:px-18 py-12 sm:py-14 md:py-20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
          {/* Left: Main CTA */}
          <div className="max-w-xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E50914]/20 bg-[#E50914]/5 mb-8"
            >
              <Star className="h-3.5 w-3.5 text-[#E50914]" />
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#E50914]">
                Appel a candidatures
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-[2.75rem] font-black text-white leading-[1.1] tracking-tight mb-7"
            >
              100 Scenaristes.<br />
              <span className="text-[#E50914]">Un Film.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-[15px] text-white/45 leading-[1.7] mb-10 max-w-md"
            >
              Nous invitons 100 scenaristes a soumettre leurs projets au vote de la communaute.
              Le scenario gagnant sera produit en film. Les auteurs sont automatiquement credites
              et coproducteurs dans la blockchain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
              <Link
                href="/register?role=SCREENWRITER"
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_0_50px_rgba(229,9,20,0.4)] hover:scale-[1.03] active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 50%, #E50914 100%)' }}
              >
                <Pen className="h-4 w-4" />
                Candidater maintenant
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/community/scenarios"
                className="text-sm text-white/40 hover:text-[#E50914] transition-colors font-medium"
              >
                Voir les scenarios soumis
              </Link>
            </motion.div>
          </div>

          {/* Right: Benefits grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-2 gap-5 lg:gap-6 max-w-sm"
          >
            {benefits.map((benefit, idx) => (
              <div
                key={benefit.label}
                className="group p-5 md:p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#E50914]/20 hover:bg-white/[0.05] transition-all duration-300"
              >
                <benefit.icon className="h-5 w-5 text-[#E50914]/70 mb-3.5 group-hover:text-[#E50914] transition-colors" />
                <p className="text-[13px] font-bold text-white/80 mb-1">{benefit.label}</p>
                <p className="text-[10px] text-white/30 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center gap-6 sm:gap-10 mt-12 pt-10 border-t border-white/[0.05]"
        >
          <div>
            <p className="text-2xl md:text-3xl font-black text-[#E50914] font-playfair">100</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Places</p>
          </div>
          <div className="h-8 w-[1px] bg-white/[0.06]" />
          <div>
            <p className="text-2xl md:text-3xl font-black text-white/80 font-playfair">1</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Film produit</p>
          </div>
          <div className="h-8 w-[1px] bg-white/[0.06]" />
          <div>
            <p className="text-2xl md:text-3xl font-black text-white/80 font-playfair">&#x221E;</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">Royalties on-chain</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
