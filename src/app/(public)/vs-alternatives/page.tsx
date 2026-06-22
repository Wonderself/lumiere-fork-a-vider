import { COMPARISON_FEATURES, COMPETITORS } from '@/data/landing-content'
import { Shield, CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'CineGeny vs Alternatives', description: 'Comparaison objective avec les alternatives' }

export default function VsAlternativesPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">CineGeny vs <span className="text-[#E50914]">Alternatives</span></h1>
          <p className="text-gray-400">Comparaison objective et transparente</p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead><tr className="border-b border-gray-800">
              <th className="text-left text-xs text-gray-500 px-6 py-4">Feature</th>
              <th className="text-center text-xs font-bold text-[#E50914] px-6 py-4 bg-[#E50914]/5">{COMPETITORS.cinegeny}</th>
              <th className="text-center text-xs text-gray-400 px-6 py-4">{COMPETITORS.competitor1}</th>
              <th className="text-center text-xs text-gray-400 px-6 py-4">{COMPETITORS.competitor2}</th>
              <th className="text-center text-xs text-gray-400 px-6 py-4">{COMPETITORS.competitor3}</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-800/50">
              {COMPARISON_FEATURES.map(row => (
                <tr key={row.feature} className="hover:bg-gray-800/30">
                  <td className="text-sm text-white px-6 py-3">{row.feature}</td>
                  <td className="text-center text-sm px-6 py-3 bg-[#E50914]/5">{row.cinegeny}</td>
                  <td className="text-center text-sm text-gray-400 px-6 py-3">{row.competitor1}</td>
                  <td className="text-center text-sm text-gray-400 px-6 py-3">{row.competitor2}</td>
                  <td className="text-center text-sm text-gray-400 px-6 py-3">{row.competitor3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5">
            <Shield className="h-4 w-4 text-emerald-400" /><span className="text-xs text-emerald-400">Comparaison objective — nous encourageons la transparence</span>
          </div>
        </div>
      </div>
    </div>
  )
}
