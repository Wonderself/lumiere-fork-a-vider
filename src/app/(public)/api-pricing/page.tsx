import { API_PLANS } from '@/data/landing-content'
import { Code, CheckCircle2, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'API Pricing — CineGeny', description: 'Tarifs API pour les développeurs' }

export default function APIPricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"><Code className="h-4 w-4 text-cyan-400" /><span className="text-sm font-medium text-cyan-400">API pour Développeurs</span></div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">Tarifs <span className="text-[#E50914]">API</span></h1>
          <p className="text-gray-400">Intégrez les agents IA cinéma dans vos applications</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {API_PLANS.map(plan => (
            <div key={plan.name} className={`rounded-2xl border p-8 ${plan.popular ? 'border-[#E50914] bg-gradient-to-b from-[#E50914]/10 to-transparent' : 'border-gray-800 bg-gray-900/50'}`}>
              {plan.popular && <Badge className="bg-[#E50914] text-white text-[10px] mb-4">POPULAIRE</Badge>}
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <p className="text-3xl font-bold text-white mt-2">{plan.price}</p>
              <p className="text-xs text-gray-500 mt-1">{plan.requests}</p>
              <ul className="mt-6 space-y-2">
                {plan.features.map(f => (<li key={f} className="flex items-center gap-2 text-xs text-gray-400"><CheckCircle2 className="h-3.5 w-3.5 text-[#E50914] shrink-0" />{f}</li>))}
              </ul>
              <button className={`w-full mt-6 py-2.5 rounded-xl text-sm font-semibold ${plan.popular ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-300'}`}>Commencer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
