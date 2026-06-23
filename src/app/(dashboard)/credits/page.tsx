import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AutoTopupForm } from '@/components/wallet/auto-topup-form'
import { microToCredits } from '@/lib/ai-pricing'
import Link from 'next/link'
import {
  Coins, TrendingUp, TrendingDown, Clock,
  Sparkles, Zap, Crown, ArrowRight,
  CheckCircle2, Info, CreditCard, Shield,
  RefreshCcw, AlertTriangle, Gift, Lock,
  ChevronRight,
} from 'lucide-react'
import { BuyCreditsButton } from '@/components/credits/buy-credits-button'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Wallet & Crédits IA — CINEGENY',
  description: 'Gérez vos crédits pour la génération IA — 0% de commission',
}

const CREDIT_PACKS = [
  {
    id: 'decouverte',
    name: 'Découverte',
    credits: 100,
    bonus: 0,
    price: 4.99,
    features: ['~2 scènes vidéo', 'Storyboards inclus', 'Support standard'],
    popular: false,
  },
  {
    id: 'createur',
    name: 'Creator',
    credits: 500,
    bonus: 50,
    price: 19.99,
    features: ['~1 bande-annonce complète', 'Toutes les fonctionnalités', 'Support prioritaire'],
    popular: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    credits: 2000,
    bonus: 400,
    price: 69.99,
    features: ['~4 bandes-annonces', 'Qualité premium', 'Support dédié', 'Exports illimités'],
    popular: false,
  },
  {
    id: 'production',
    name: 'Production',
    credits: 10000,
    bonus: 3000,
    price: 299.99,
    features: ['Production intensive', 'Tous les modèles IA', 'Account manager', 'API access'],
    popular: false,
  },
]

const TX_TYPE_CONFIG: Record<string, { label: string; icon: typeof TrendingUp; color: string }> = {
  PACK_PURCHASE: { label: 'Achat de pack', icon: CreditCard, color: 'text-green-600' },
  ADMIN_GRANT: { label: 'Crédit admin', icon: Crown, color: 'text-purple-600' },
  SUBSCRIPTION_GRANT: { label: 'Crédit abonnement', icon: Sparkles, color: 'text-blue-600' },
  AI_USAGE: { label: 'Utilisation IA', icon: Zap, color: 'text-orange-600' },
  REFUND: { label: 'Remboursement', icon: RefreshCcw, color: 'text-green-600' },
  CONTEST_PRIZE: { label: 'Prix concours', icon: Crown, color: 'text-[#E50914]' },
  REFERRAL_BONUS: { label: 'Bonus parrainage', icon: Gift, color: 'text-emerald-600' },
  PROMO_CODE: { label: 'Code promo', icon: Sparkles, color: 'text-pink-600' },
  HOLD: { label: 'Réservation crédits', icon: Lock, color: 'text-yellow-600' },
  HOLD_RELEASE: { label: 'Libération réservation', icon: RefreshCcw, color: 'text-green-600' },
  HOLD_OVERAGE: { label: 'Ajustement coût', icon: AlertTriangle, color: 'text-orange-600' },
  AUTO_TOPUP: { label: 'Rechargement auto', icon: RefreshCcw, color: 'text-blue-600' },
  EXPIRY: { label: 'Expiration', icon: Clock, color: 'text-white/50' },
}

export default async function WalletCreditsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [creditAccount, transactions, subscription] = await Promise.all([
    prisma.creditAccount.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    }),
    prisma.creditTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
    }),
  ])

  const balance = creditAccount.balance
  const balanceDisplay = microToCredits(balance)
  const totalUsed = creditAccount.totalUsed
  const totalPurchased = creditAccount.totalPurchased + creditAccount.totalGranted
  const isPremium = subscription?.plan === 'PREMIUM' && (subscription?.status === 'ACTIVE' || subscription?.status === 'active')

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Wallet & Crédits IA
          </h1>
          <p className="text-sm text-white/60 mt-2">
            Gérez vos crédits pour la création de contenu IA
          </p>
        </div>
        <Link
          href="/pricing-ia"
          className="flex items-center gap-1.5 text-sm text-[#E50914] hover:text-[#FF2D2D] transition-colors"
        >
          Voir les tarifs détaillés
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* 0% Commission Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-400">0% de commission</p>
            <p className="text-xs text-emerald-400/70 mt-0.5">
              Vous ne payez que le coût réel des tokens IA. Aucune marge, aucun surcoût caché.
              Consultez nos <Link href="/pricing-ia" className="underline hover:text-emerald-300">tarifs transparents</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="rounded-2xl border border-[#E50914]/20 bg-gradient-to-br from-[#E50914]/5 to-transparent p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#E50914]/10 flex items-center justify-center">
              <Coins className="h-5 w-5 text-[#E50914]" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-medium">Solde actuel</p>
              <p className="text-2xl font-bold text-[#E50914]">{balanceDisplay.toFixed(2)}</p>
              <p className="text-[10px] text-white/50">{balance.toLocaleString()} µ-crédits</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/15 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-medium">Total acquis</p>
              <p className="text-2xl font-bold text-white">{microToCredits(totalPurchased).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-medium">Total used</p>
              <p className="text-2xl font-bold text-white">{microToCredits(totalUsed).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Banner */}
      {isPremium && (
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <Crown className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm font-semibold text-purple-400">Abonnement Premium</p>
              <p className="text-xs text-purple-400/70">1 bande-annonce gratuite par semaine incluse — {creditAccount.weeklyFreeUsed}/1 utilisée</p>
            </div>
          </div>
        </div>
      )}

      {/* Auto-topup Settings */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Rechargement automatique</h2>
        <AutoTopupForm
          enabled={creditAccount.autoTopupEnabled}
          threshold={creditAccount.autoTopupThreshold}
          amount={creditAccount.autoTopupAmount}
        />
      </div>

      {/* Credit Packs */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Buy credits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.name}
              className={`relative rounded-2xl border p-4 sm:p-6 transition-all hover:shadow-lg shadow-[0_2px_8px_rgba(0,0,0,0.3)] ${
                pack.popular
                  ? 'border-[#E50914] bg-gradient-to-b from-[#E50914]/5 to-transparent shadow-[#E50914]/10'
                  : 'border-white/10 bg-white/5 hover:border-white/10'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#E50914] text-white text-[10px] font-semibold px-3">
                    POPULAIRE
                  </Badge>
                </div>
              )}
              <div className="text-center mb-4">
                <h3 className="text-base font-bold text-white">{pack.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-white">{pack.price}€</span>
                </div>
                <p className="text-sm text-[#E50914] font-semibold mt-1">
                  {pack.credits.toLocaleString()} crédits
                  {pack.bonus > 0 && <span className="text-green-600"> +{pack.bonus} bonus</span>}
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                  {(pack.price / (pack.credits + pack.bonus) * 100).toFixed(1)} centimes/crédit
                </p>
              </div>
              <ul className="space-y-2.5 mb-5">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-white/60">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E50914] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <BuyCreditsButton
                packId={pack.id}
                amount={pack.credits + pack.bonus}
                popular={pack.popular}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
          <Info className="h-3.5 w-3.5" />
          <span>Paiement sécurisé via Stripe. Crédits crédités instantanément après confirmation.</span>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Historique des transactions</h2>
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.3)] p-8 text-center">
            <Clock className="h-10 w-10 text-white/30 mx-auto mb-3" />
            <p className="text-sm text-white/60">Aucune transaction pour le moment</p>
            <p className="text-xs text-white/50 mt-1">Vos achats et utilisations de crédits apparaîtront ici</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.3)] overflow-hidden">
            <div className="divide-y divide-white/10">
              {transactions.map((tx) => {
                const config = TX_TYPE_CONFIG[tx.type] || TX_TYPE_CONFIG.AI_USAGE
                const TxIcon = config.icon
                const isPositive = tx.amount > 0
                return (
                  <div key={tx.id} className="flex items-center gap-4 p-4 sm:p-5 hover:bg-white/[0.03] transition-colors">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${isPositive ? 'bg-green-500/15' : 'bg-orange-500/15'}`}>
                      <TxIcon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{config.label}</p>
                      {tx.description && <p className="text-xs text-white/50 truncate">{tx.description}</p>}
                      {tx.aiModel && (
                        <p className="text-[10px] text-white/50 mt-0.5">
                          {tx.aiProvider} / {tx.aiModel}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-orange-600'}`}>
                        {isPositive ? '+' : ''}{microToCredits(tx.amount).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-white/50">
                        {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
