'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { REFERRAL_TIERS, SAMPLE_LEADERBOARD, generateReferralCode, SIGNUP_BONUS, GROWTH_AGENTS } from '@/data/growth'
import { microToCredits } from '@/lib/ai-pricing'
import {
  Users, Copy, Check, Gift, Trophy, Star, TrendingUp,
  ChevronRight, Award, Zap, Shield, Heart, Crown,
  CheckCircle2,
} from 'lucide-react'

export default function ReferralPage() {
  const [referralCode] = useState(generateReferralCode())
  const [copied, setCopied] = useState(false)
  const [referralCount] = useState(3)

  async function copyLink() {
    await navigator.clipboard.writeText(`https://cinegen.com/register?ref=${referralCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Lien de parrainage copié !')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Users className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Programme de Parrainage</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
            Invitez, <span className="text-[#E50914]">Gagnez</span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Parrainez vos amis et gagnez des crédits IA + XP. Plus vous parrainez, plus les récompenses augmentent.
          </p>
        </div>

        {/* Referral Code Card */}
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-900/30 p-8 text-center mb-10">
          <p className="text-xs text-gray-400 mb-3">Votre code de parrainage</p>
          <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 max-w-sm mx-auto flex items-center gap-3 mb-4">
            <code className="flex-1 text-xl font-mono font-bold text-white tracking-wider">{referralCode}</code>
            <button onClick={copyLink} className="px-4 py-2 rounded-lg bg-[#E50914] text-white text-sm font-medium hover:bg-[#FF2D2D]">
              {copied ? <><Check className="inline h-4 w-4 mr-1" />Copié</> : <><Copy className="inline h-4 w-4 mr-1" />Copier le lien</>}
            </button>
          </div>
          <p className="text-xs text-gray-500">Vous avez parrainé <span className="text-white font-bold">{referralCount}</span> personne(s)</p>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
            <Gift className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white">Pour vous (parrain)</p>
            <p className="text-xs text-gray-400 mt-1">Jusqu&apos;à 25 crédits par filleul + XP + badges</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
            <Heart className="h-8 w-8 text-pink-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-white">Pour votre ami (filleul)</p>
            <p className="text-xs text-gray-400 mt-1">{SIGNUP_BONUS.label} à l&apos;inscription + bonus parrainage</p>
          </div>
        </div>

        {/* Tiers */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" /> Paliers de récompenses
          </h2>
          <div className="space-y-3">
            {REFERRAL_TIERS.map((tier, i) => {
              const isReached = referralCount >= tier.count
              return (
                <div key={i} className={`rounded-xl border p-5 flex items-center gap-4 ${isReached ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-800 bg-gray-900/30'}`}>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${isReached ? 'bg-emerald-500/10' : 'bg-gray-800'}`}>
                    {tier.badge ? '🏆' : '🎯'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{tier.count} filleuls</p>
                    <p className="text-[10px] text-gray-500">{tier.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-400">+{microToCredits(tier.referrerReward).toFixed(0)} cr</p>
                    <p className="text-[10px] text-yellow-400">+{tier.bonusXP} XP</p>
                  </div>
                  {isReached && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" /> Top Parrains
          </h2>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 overflow-hidden">
            <div className="divide-y divide-gray-800/50">
              {SAMPLE_LEADERBOARD.map(entry => (
                <div key={entry.rank} className="flex items-center gap-4 px-5 py-3">
                  <span className={`text-lg font-bold w-8 text-center ${entry.rank <= 3 ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">{entry.initials}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{entry.initials}</p>
                    <p className="text-[10px] text-gray-500">{entry.tier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{entry.referralCount} filleuls</p>
                    <p className="text-[10px] text-emerald-400">{microToCredits(entry.totalEarned).toFixed(0)} cr gagnés</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
