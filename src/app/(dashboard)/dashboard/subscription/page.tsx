import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserSubscription, cancelSubscriptionAction } from '@/app/actions/subscriptions'
import { PLAN_CONFIGS } from '@/lib/subscription-plans'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  Crown,
  Check,
  X,
  ArrowRight,
  Tv,
  Download,
  Monitor,
  Shield,
  AlertTriangle,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Mon Abonnement — CINEGENY' }

function CancelButton() {
  return (
    <form action={async () => {
      'use server'
      await cancelSubscriptionAction()
    }}>
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 hover:border-red-500/30 transition-all"
      >
        <X className="h-4 w-4" />
        Annuler mon abonnement
      </button>
    </form>
  )
}

export default async function SubscriptionPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const subscription = await getUserSubscription(session.user.id)

  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    expired: { label: 'Expiré', color: 'bg-white/[0.05] text-white/50 border-white/10' },
  }

  const currentStatus = subscription.status || (subscription.active ? 'active' : 'expired')
  const statusDisplay = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.active

  const isFree = subscription.plan === 'FREE'
  const canCancel = !isFree && currentStatus === 'active'

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Mon Abonnement
        </h1>
        <p className="text-white/50 mt-1">
          Gérez votre plan de streaming et vos préférences.
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white/5 rounded-2xl border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#E50914]/20 to-[#E50914]/5 border border-[#E50914]/20 flex items-center justify-center">
                <Crown className="h-7 w-7 text-[#E50914]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2
                    className="text-2xl font-bold text-white"
                  >
                    Plan {subscription.name}
                  </h2>
                  <Badge variant="outline" className={statusDisplay.color}>
                    {statusDisplay.label}
                  </Badge>
                </div>
                {!isFree && (
                  <p className="text-[#E50914] font-semibold text-lg mt-0.5">
                    {subscription.priceEur}€<span className="text-white/50 text-sm font-normal">/mois</span>
                  </p>
                )}
                {isFree && (
                  <p className="text-white/50 text-sm mt-0.5">
                    Plan gratuit avec fonctionnalités limitées
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Plan dates */}
          {!isFree && (
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              {'startedAt' in subscription && subscription.startedAt && (
                <div className="flex items-center gap-2 text-white/50">
                  <CreditCard className="h-4 w-4 text-white/50" />
                  <span>Depuis le {new Date(subscription.startedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
              {'expiresAt' in subscription && subscription.expiresAt && (
                <div className="flex items-center gap-2 text-white/50">
                  <Shield className="h-4 w-4 text-white/50" />
                  <span>
                    {currentStatus === 'cancelled' ? 'Accès jusqu\'au' : 'Renouvellement le'}{' '}
                    {new Date(subscription.expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Features list */}
        <div className="border-t border-white/10 px-6 sm:px-8 py-6">
          <h3 className="text-sm font-semibold text-white mb-4">Inclus dans votre plan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subscription.features.map((feature: string) => (
              <div key={feature} className="flex items-center gap-2.5">
                <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-green-500" />
                </div>
                <span className="text-sm text-white/60">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan details grid */}
        <div className="border-t border-white/10 px-6 sm:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <Monitor className="h-5 w-5 text-white/50 mx-auto mb-1.5" />
              <p className="text-sm font-semibold text-white">{subscription.maxQuality}</p>
              <p className="text-xs text-white/50">Qualité max</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <Tv className="h-5 w-5 text-white/50 mx-auto mb-1.5" />
              <p className="text-sm font-semibold text-white">
                {subscription.maxStreams === -1 ? 'Illimité' : subscription.maxStreams}
              </p>
              <p className="text-xs text-white/50">Films/mois</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <Download className="h-5 w-5 text-white/50 mx-auto mb-1.5" />
              <p className="text-sm font-semibold text-white">
                {subscription.offlineDownloads === -1 ? 'Illimité' : subscription.offlineDownloads}
              </p>
              <p className="text-xs text-white/50">Downloads</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-white/10 px-6 sm:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/streaming"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] text-white text-sm font-medium hover:bg-[#FF2D2D] transition-all"
            >
              <ArrowRight className="h-4 w-4" />
              {isFree ? 'Changer de plan' : 'Voir les autres plans'}
            </Link>

            {canCancel && <CancelButton />}
          </div>
        </div>
      </div>

      {/* Cancelled notice */}
      {currentStatus === 'cancelled' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-white/90">Abonnement annulé</h3>
            <p className="text-sm text-white/60 mt-1">
              Votre abonnement a été annulé. Vous conservez l&apos;accès à toutes les fonctionnalités premium
              jusqu&apos;à la fin de votre période de facturation en cours.
              Vous pouvez réactiver votre abonnement à tout moment.
            </p>
            <Link
              href="/streaming"
              className="inline-flex items-center gap-1.5 mt-3 text-sm text-[#E50914] hover:text-[#FF2D2D] font-medium"
            >
              Réactiver mon abonnement <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Upgrade banner for free users */}
      {isFree && (
        <div className="bg-gradient-to-r from-[#E50914]/10 to-[#E50914]/[0.04] border border-[#E50914]/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#E50914]/15 flex items-center justify-center shrink-0">
              <Crown className="h-6 w-6 text-[#E50914]" />
            </div>
            <div className="flex-1">
              <h3
                className="text-lg font-bold text-white"
              >
                Passez à un plan supérieur
              </h3>
              <p className="text-sm text-white/60 mt-1">
                Débloquez le streaming illimité, la HD/4K, les téléchargements hors ligne et bien plus.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {Object.values(PLAN_CONFIGS).filter(p => p.priceEur > 0).map((plan) => (
                  <Link
                    key={plan.id}
                    href="/streaming"
                    className="px-4 py-2 rounded-xl border border-[#E50914]/30 bg-white/5 text-sm font-medium text-white/80 hover:border-[#E50914] hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all"
                  >
                    {plan.name} — {plan.priceEur}€/mois
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
