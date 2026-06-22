'use client'

import Link from 'next/link'
import { Film, Image, ArrowRight, Sparkles, User, Play } from 'lucide-react'

export function CreativeShowcase() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E50914]/20 bg-[#E50914]/[0.06] text-xs text-[#E50914] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Coup de cœur
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Créez en <span className="text-[#E50914]">30 secondes</span>
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto">
            Inventez un film, l&apos;IA fait le reste. Bande-annonce et affiche professionnelle, avec votre visage en option.
          </p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Trailer Maker */}
          <Link
            href="/trailer-maker"
            className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden hover:border-[#E50914]/30 transition-all duration-500"
          >
            {/* Background image */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <img
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=40"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
            </div>

            <div className="relative p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
                  <Film className="h-5 w-5 text-[#E50914]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#E50914] transition-colors">
                    Trailer Maker
                  </h3>
                  <p className="text-[10px] text-white/30">Bande-annonce IA</p>
                </div>
              </div>

              <p className="text-sm text-white/50 leading-relaxed mb-5">
                Inventez un film, choisissez le style (blockbuster, indie, horreur...) et recevez une bande-annonce générée par l&apos;IA.
              </p>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-white/40 border border-white/[0.08]">
                  <Play className="inline h-3 w-3 mr-0.5" /> 6 styles
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-white/40 border border-white/[0.08]">
                  <User className="inline h-3 w-3 mr-0.5" /> Votre visage
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-white/40 border border-white/[0.08]">
                  <Sparkles className="inline h-3 w-3 mr-0.5" /> Multi-scènes
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#E50914] font-medium group-hover:gap-3 transition-all">
                Créer ma bande-annonce
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Poster Maker */}
          <Link
            href="/poster-maker"
            className="group relative rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden hover:border-[#E50914]/30 transition-all duration-500"
          >
            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
              <img
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=40"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
            </div>

            <div className="relative p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Image className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                    Poster Maker
                  </h3>
                  <p className="text-[10px] text-white/30">Affiche de film IA</p>
                </div>
              </div>

              <p className="text-sm text-white/50 leading-relaxed mb-5">
                Créez une affiche de film professionnelle en quelques clics. Ajoutez votre visage pour devenir la star.
              </p>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-white/40 border border-white/[0.08]">
                  <Image className="inline h-3 w-3 mr-0.5" /> 5 styles
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-white/40 border border-white/[0.08]">
                  <User className="inline h-3 w-3 mr-0.5" /> Face insert
                </span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-white/40 border border-white/[0.08]">
                  3 formats
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-purple-400 font-medium group-hover:gap-3 transition-all">
                Créer mon affiche
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
