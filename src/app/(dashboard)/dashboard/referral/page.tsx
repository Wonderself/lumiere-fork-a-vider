'use client'

import { useState, useEffect, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import { getReferralCode, getReferralStats } from '@/app/actions/referral'
import {
  Users, Copy, Check, Share2, Gift, TrendingUp, Link2, Clock, CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ReferralData = Awaited<ReturnType<typeof getReferralStats>>

export default function ReferralPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<ReferralData>(null)
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const [statsResult, codeResult] = await Promise.all([
        getReferralStats(),
        getReferralCode(),
      ])
      setData(statsResult)
      setCode(codeResult.code)
    })
  }, [])

  const referralLink = code
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/register?ref=${code}`
    : null

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-playfair">
          Parrainage
        </h1>
        <p className="text-white/50 mt-1">
          Invitez des amis et gagnez des Lumens ensemble.
        </p>
      </div>

      {/* How it works */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
        <h2 className="text-sm font-bold text-white/90 mb-4 flex items-center gap-2">
          <Gift className="h-4 w-4 text-[#E50914]" />
          Comment ca marche
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Partagez votre lien', desc: 'Envoyez votre lien unique a vos amis', icon: Share2 },
            { step: '2', title: 'Ils s\'inscrivent', desc: 'Votre filleul cree son compte CINEGENY', icon: Users },
            { step: '3', title: 'Bonus pour tous', desc: '+30 Lumens pour vous, +10 pour eux', icon: TrendingUp },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[#E50914]/15 flex items-center justify-center text-sm font-bold text-[#E50914] shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90">{item.title}</p>
                <p className="text-xs text-white/50">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Code & Link */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <h2 className="text-sm font-bold text-white/90 mb-4 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-[#E50914]" />
          Votre lien de parrainage
        </h2>

        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-white/[0.05] rounded-xl" />
            <div className="h-12 bg-white/[0.05] rounded-xl" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Code */}
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-sm text-white/80 truncate">
                {code || '...'}
              </div>
              <button
                onClick={() => code && handleCopy(code)}
                className="px-4 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-colors text-white/60"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* Link */}
            {referralLink && (
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-white/80 truncate">
                  {referralLink}
                </div>
                <button
                  onClick={() => handleCopy(referralLink)}
                  className="px-4 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] transition-colors text-white font-semibold text-sm whitespace-nowrap"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      {data && (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Filleuls', value: data.total, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Actives', value: data.completed, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
              { label: 'Lumens Gagnes', value: data.totalEarned, icon: TrendingUp, color: 'text-[#E50914]', bg: 'bg-amber-500/10' },
            ].map((stat) => (
              <div key={stat.label} className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.3)] text-center">
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${stat.bg} mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-white font-playfair">
                  {stat.value}
                </div>
                <div className="text-xs text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Referral list */}
          {data.referrals.length > 0 && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              <h2 className="text-sm font-bold text-white/90 mb-4">Vos filleuls</h2>
              <div className="space-y-2">
                {data.referrals.map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center text-xs',
                        r.status === 'COMPLETED' ? 'bg-green-500/15 text-green-400' : 'bg-white/[0.05] text-white/50'
                      )}>
                        {r.status === 'COMPLETED' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/80">
                          {r.referred?.displayName || 'Utilisateur'}
                        </p>
                        <p className="text-xs text-white/50">
                          Inscrit le {new Intl.DateTimeFormat('fr-FR').format(new Date(r.createdAt))}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-medium',
                        r.status === 'COMPLETED' ? 'bg-green-500/15 text-green-400' : 'bg-white/[0.05] text-white/50'
                      )}>
                        {r.status === 'COMPLETED' ? `+${r.tokensEarned} Lumens` : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
