import { getAllPricing } from '@/lib/ai-pricing'
import { Shield, Cpu, Image, Video, Music, FileText, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs IA Transparents — CINEGENY',
  description: 'Découvrez nos tarifs IA transparents. 0% de commission — vous ne payez que le coût réel des tokens.',
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof Cpu; color: string }> = {
  script: { label: 'Scénario & Analyse', icon: FileText, color: 'text-blue-400' },
  image: { label: 'Images & Storyboard', icon: Image, color: 'text-purple-400' },
  video: { label: 'Vidéo & Animation', icon: Video, color: 'text-[#E50914]' },
  audio: { label: 'Audio & Musique', icon: Music, color: 'text-emerald-400' },
  analysis: { label: 'Analyse & IA', icon: Cpu, color: 'text-orange-400' },
}

export default function PricingIAPage() {
  const pricing = getAllPricing()

  const actionsByCategory = pricing.actions.reduce((acc, action) => {
    const cat = action.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(action)
    return acc
  }, {} as Record<string, typeof pricing.actions>)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-4">
          <Link
            href="/credits"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au Wallet
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">0% de commission</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
            Tarifs IA Transparents
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Vous ne payez que le coût réel des tokens IA. Pas de marge cachée, pas de surcoût.
            Chaque centime est traçable.
          </p>
        </div>

        {/* Commission Banner */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-transparent p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Shield className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-white mb-2">Notre philosophie : 0% de commission</h2>
              <p className="text-gray-400 leading-relaxed">
                Contrairement aux autres plateformes qui prennent 20-40% de marge sur les coûts IA,
                CineGeny répercute le coût exact des fournisseurs IA. Vous ne payez que ce que l&apos;IA coûte réellement.
                Notre modèle repose sur les abonnements, pas sur une taxe sur votre créativité.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Marge actuelle : <span className="text-emerald-400 font-semibold">{pricing.marginPercent}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions Pricing by Category */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Prix par action</h2>
          <div className="space-y-8">
            {Object.entries(actionsByCategory).map(([category, actions]) => {
              const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.analysis
              const CategoryIcon = config.icon
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-4">
                    <CategoryIcon className={`h-5 w-5 ${config.color}`} />
                    <h3 className="text-lg font-semibold text-white">{config.label}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {actions.map((action) => (
                      <div
                        key={action.id}
                        className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 hover:border-gray-700 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">{action.label}</h4>
                          <span className="text-lg font-bold text-[#E50914]">
                            {action.costCredits.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{action.description}</p>
                        <div className="text-[10px] text-gray-600">
                          crédits par utilisation
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Model Pricing Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Prix par modèle IA (token-based)</h2>
          <p className="text-sm text-gray-400 mb-8">
            Pour les actions basées sur les tokens (analyse de texte, génération de script, etc.)
          </p>
          <div className="rounded-2xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-900">
                  <th className="text-left text-xs font-medium text-gray-400 px-6 py-4">Modèle</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-6 py-4">Fournisseur</th>
                  <th className="text-right text-xs font-medium text-gray-400 px-6 py-4">Input / 1M tokens</th>
                  <th className="text-right text-xs font-medium text-gray-400 px-6 py-4">Output / 1M tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {pricing.models.filter(m => m.inputPer1M > 0).map((model) => (
                  <tr key={model.id} className="hover:bg-gray-900/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-white">{model.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 capitalize">{model.provider}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-white">
                        {model.inputPer1MCredited.toFixed(2)} cr
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-white">
                        {model.outputPer1MCredited.toFixed(2)} cr
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-gray-600 mt-3">
            cr = crédits. 1 crédit = 1 000 000 µ-crédits. Les prix reflètent les coûts exacts des fournisseurs IA.
          </p>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Pourquoi 0% de commission ?',
                a: 'Nous croyons que la créativité ne devrait pas être taxée. Notre revenu provient des abonnements, pas d\'une marge sur vos créations IA.',
              },
              {
                q: 'Comment sont calculés les coûts ?',
                a: 'Chaque action IA a un coût fixe en crédits, basé sur le coût réel du fournisseur IA. Pour les modèles de langage, le coût dépend du nombre de tokens (mots) traités.',
              },
              {
                q: 'Que se passe-t-il si une génération échoue ?',
                a: 'Si une action IA échoue pour une raison technique (timeout, erreur serveur), vos crédits sont automatiquement remboursés. Aucune déduction si l\'action ne produit pas de résultat.',
              },
              {
                q: 'Puis-je choisir le modèle IA ?',
                a: 'Pour certaines actions (analyse de script, brainstorming), vous pouvez choisir le modèle. Pour d\'autres (génération vidéo, cohérence du film), le modèle est imposé pour garantir la qualité et la cohérence avec votre projet.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-gray-800 bg-gray-900/30 p-6">
                <h3 className="text-sm font-semibold text-white mb-2">{q}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/credits"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl transition-colors"
          >
            <Zap className="h-5 w-5" />
            Recharger mes crédits
          </Link>
        </div>
      </div>
    </div>
  )
}
