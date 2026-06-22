import Link from 'next/link'
import { Film, Zap, Star, ArrowRight, CheckCircle2, Bot, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Cas d\'usage — Créateur | CineGeny', description: 'Comment un créateur utilise CineGeny pour produire son film' }

export default function CreateurCasePage() {
  const steps = [
    { title: 'Écrivez votre scénario', desc: 'L\'agent Scénariste IA vous guide dans l\'écriture : structure 3 actes, dialogues, personnages.', icon: '✍️' },
    { title: 'Construisez la mémoire du film', desc: 'Remplissez les 8 catégories de la bible film pour que chaque IA reste cohérente.', icon: '🧠' },
    { title: 'Générez les visuels', desc: 'Storyboards, concept art, affiches — le Studio Créatif produit tout.', icon: '🎨' },
    { title: 'Créez la bande-annonce', desc: 'Le Trailer Maker assemble une BA professionnelle en plusieurs styles.', icon: '🎬' },
    { title: 'Soumettez au vote', desc: 'La communauté vote. Si le film est sélectionné, la production commence.', icon: '🗳️' },
    { title: 'Collaborez et produisez', desc: 'Invitez des collaborateurs, distribuez les rôles, lancez la production.', icon: '🤝' },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 mb-6"><Film className="h-4 w-4 text-[#E50914]" /><span className="text-sm font-medium text-[#E50914]">Cas d&apos;usage</span></div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">Vous êtes <span className="text-[#E50914]">Créateur</span></h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">Réalisez votre rêve de cinéma sans budget Hollywood. CineGeny démocratise la création.</p>
        </div>

        <div className="space-y-6 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="h-12 w-12 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center text-2xl shrink-0">{step.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center mb-12">
          <Shield className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">0% de commission sur l&apos;IA</h3>
          <p className="text-sm text-gray-400">Vous ne payez que le coût réel des tokens IA. Aucun surcoût caché.</p>
        </div>

        <div className="text-center">
          <Link href="/create" className="inline-flex items-center gap-2 px-8 py-4 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-2xl transition-colors text-lg"><Zap className="h-6 w-6" />Commencer à créer</Link>
        </div>
      </div>
    </div>
  )
}
