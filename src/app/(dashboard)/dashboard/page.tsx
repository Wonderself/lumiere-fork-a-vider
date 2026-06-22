import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Film, Settings, Coins, Star, TrendingUp,
  Tv, ArrowRight, Crown, CheckCircle2,
  Vote, CircleDollarSign,
  Building2, CreditCard, Key, ShieldCheck,
  Landmark, Globe, Server, ExternalLink,
  AlertCircle, Square, ChevronRight,
  Scale, Search, Clapperboard, PlayCircle, PiggyBank, Users, Sparkles, Zap, Banknote,
} from 'lucide-react'
import { getRecommendedTasks } from '@/app/actions/recommendations'
import { TASK_TYPE_LABELS, DIFFICULTY_LABELS } from '@/lib/constants'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          submissions: true,
          catalogFilms: true,
        },
      },
    },
  })

  if (!user) redirect('/login')

  // Tokenization data
  const tokenPurchases = await prisma.filmTokenPurchase.findMany({
    where: { userId: user.id, status: 'CONFIRMED' },
    select: { tokenCount: true },
  })
  const totalTokensHeld = tokenPurchases.reduce((sum, p) => sum + p.tokenCount, 0)

  const pendingDividends = await prisma.tokenDividend.count({
    where: { userId: user.id, status: 'PENDING' },
  })

  const activeProposals = await prisma.governanceProposal.count({
    where: {
      status: 'ACTIVE',
      deadline: { gt: new Date() },
    },
  })

  // Check if user has voted on active proposals
  const userVotesOnActive = await prisma.governanceVote.count({
    where: {
      userId: user.id,
      proposal: { status: 'ACTIVE', deadline: { gt: new Date() } },
    },
  })
  const unvotedProposals = activeProposals - userVotesOnActive

  const isAdmin = user.role === 'ADMIN'

  // Get personalized task recommendations
  const recommendations = await getRecommendedTasks().catch(() => [])

  const now = new Date()
  const frenchDate = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-12">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-white/60 text-sm capitalize mb-2">{frenchDate}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Bonjour, {user.displayName || 'Contributeur'}
          </h1>
          <p className="text-white/60 mt-2 text-sm">Votre hub central</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914]">
            <Crown className="h-3 w-3 mr-1" />
            {user.level}
          </Badge>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10">
            <Coins className="h-4 w-4 text-[#E50914]" />
            <span className="text-white text-sm font-semibold">{user.lumenBalance}</span>
            <span className="text-white/60 text-xs">Lumens</span>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Taches completees', value: user.tasksCompleted, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Points', value: user.points, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { label: 'Reputation', value: `${user.reputationScore}/100`, icon: Star, color: 'text-[#E50914]', bg: 'bg-[#E50914]/10' },
          { label: 'Tokens Film', value: totalTokensHeld, icon: Coins, color: 'text-amber-500', bg: 'bg-[#E50914]/100/10' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10/60 p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4 min-h-[52px]">
              <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-lg sm:text-xl font-bold leading-tight truncate">{kpi.value}</p>
                <p className="text-white/60 text-xs mt-1 truncate">{kpi.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts — Tokenization only */}
      {(pendingDividends > 0 || unvotedProposals > 0) && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          {pendingDividends > 0 && (
            <Link href="/tokenization/portfolio" className="flex-1 min-w-0 sm:min-w-[240px]">
              <div className="bg-[#E50914]/100/10 border border-amber-500/20 rounded-2xl hover:border-amber-500/30 transition-all p-4 flex items-center gap-3">
                <CircleDollarSign className="h-5 w-5 text-amber-500" />
                <span className="text-white/80 text-sm">{pendingDividends} dividende(s) a reclamer</span>
                <ArrowRight className="h-4 w-4 text-white/50 ml-auto" />
              </div>
            </Link>
          )}
          {unvotedProposals > 0 && (
            <Link href="/tokenization/governance" className="flex-1 min-w-0 sm:min-w-[240px]">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl hover:border-purple-500/30 transition-all p-4 flex items-center gap-3">
                <Vote className="h-5 w-5 text-purple-500" />
                <span className="text-white/80 text-sm">{unvotedProposals} vote(s) en attente</span>
                <ArrowRight className="h-4 w-4 text-white/50 ml-auto" />
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Task Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#E50914]" />
            <h2 className="text-white font-bold text-lg font-playfair">
              Recommande pour vous
            </h2>
          </div>
          <Link href="/tasks" className="text-sm text-[#E50914] hover:underline">
            Voir toutes →
          </Link>
        </div>
        {recommendations.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((rec) => (
              <Link key={rec.id} href={`/tasks/${rec.id}`}>
                <div className="relative bg-white/5 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10/60 p-4 sm:p-6 hover:border-[#E50914]/30 hover:shadow-md transition-all group">
                  {rec.isSkillMatch && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#E50914]/10 text-[#E50914] text-[10px] font-bold">
                      MATCH
                    </span>
                  )}
                  <p className="text-sm font-semibold text-white/90 mb-2 line-clamp-1 pr-14">{rec.title}</p>
                  <p className="text-xs text-white/50 mb-3 truncate">
                    {rec.filmTitle} · {(TASK_TYPE_LABELS as Record<string, string>)[rec.type] || rec.type}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">
                      {(DIFFICULTY_LABELS as Record<string, string>)[rec.difficulty] || rec.difficulty}
                    </span>
                    <span className="text-sm font-bold text-[#E50914]">{rec.priceEuros}€</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10/60 p-6 sm:p-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#E50914]/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-[#E50914]/60" />
            </div>
            <p className="text-white/60 font-semibold mb-1">Pas encore de recommandations</p>
            <p className="text-white/60 text-sm max-w-sm mx-auto mb-5">Completez votre profil et realisez vos premieres taches pour recevoir des recommandations personnalisees.</p>
            <Link href="/tasks" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E50914] text-white text-sm font-medium hover:bg-[#FF2D2D] transition-colors">
              Explorer les taches disponibles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Module 1 -- Studio Films */}
        <Link href="/tasks">
          <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10/60 hover:border-[#E50914]/40 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-[#E50914]/10 flex items-center justify-center">
                <Film className="h-5 w-5 text-[#E50914]" />
              </div>
              <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-[#E50914] transition-colors" />
            </div>
            <h3 className="text-white font-semibold text-base">Studio Films</h3>
            <p className="text-white/60 text-sm leading-relaxed">Micro-taches cinema, VFX, doublage, montage.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <span className="text-white/50 text-xs">{user.tasksCompleted} taches</span>
              <span className="text-white/30">|</span>
              <span className="text-white/50 text-xs">{user.tasksValidated} validees</span>
            </div>
          </div>
        </Link>

        {/* Module 2 -- Streaming */}
        <Link href="/streaming">
          <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10/60 hover:border-red-500/40 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Tv className="h-5 w-5 text-red-500" />
              </div>
              <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-red-400 transition-colors" />
            </div>
            <h3 className="text-white font-semibold text-base">Streaming</h3>
            <p className="text-white/60 text-sm leading-relaxed">Soumettez et regardez les films IA.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <span className="text-white/50 text-xs">{user._count.catalogFilms} films soumis</span>
            </div>
          </div>
        </Link>

        {/* Module 3 -- Investissement */}
        <Link href="/tokenization">
          <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10/60 hover:border-amber-500/40 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-11 w-11 rounded-xl bg-[#E50914]/100/10 flex items-center justify-center">
                <Coins className="h-5 w-5 text-amber-500" />
              </div>
              <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-amber-600 transition-colors" />
            </div>
            <h3 className="text-white font-semibold text-base">Investissement</h3>
            <p className="text-white/60 text-sm leading-relaxed">Tokens de films, dividendes, gouvernance.</p>
            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <span className="text-amber-500 text-xs">{totalTokensHeld} tokens</span>
              {pendingDividends > 0 && (
                <>
                  <span className="text-white/30">|</span>
                  <span className="text-green-500 text-xs">{pendingDividends} dividende(s)</span>
                </>
              )}
            </div>
          </div>
        </Link>

        {/* Module 4 -- Admin (admin only) */}
        {isAdmin && (
          <Link href="/admin">
            <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10/60 hover:border-orange-500/40 hover:shadow-md transition-all h-full group p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-11 w-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-orange-500" />
                </div>
                <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-orange-600 transition-colors" />
              </div>
              <h3 className="text-white font-semibold text-base">Administration</h3>
              <p className="text-white/60 text-sm leading-relaxed">Utilisateurs, catalogue, payouts.</p>
            </div>
          </Link>
        )}
      </div>

      {/* Screenwriter Banner */}
      {(user.role === 'SCREENWRITER' || user.role === 'ADMIN') && (
        <Link href="/dashboard/screenwriter" className="block p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#E50914]/10 to-amber-500/10 border border-white/10 hover:border-[#E50914]/30 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#E50914]/15 flex items-center justify-center">
                <Scale className="h-5 w-5 text-[#E50914]" />
              </div>
              <div>
                <h3 className="font-semibold text-white/90 text-sm">Espace Scenariste</h3>
                <p className="text-xs text-white/50">Gerez vos scenarios, suivez les votes et scores IA</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-white/50 group-hover:text-[#E50914] transition-colors" />
          </div>
        </Link>
      )}

      {/* Referral Banner */}
      <Link href="/dashboard/referral" className="block p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10 hover:border-purple-500/30 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white/90 text-sm">Parrainage</h3>
              <p className="text-xs text-white/50">Invitez des amis et gagnez 30 Lumens par filleul</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-white/50 group-hover:text-purple-500 transition-colors" />
        </div>
      </Link>

      {/* Earnings Banner */}
      <Link href="/dashboard/earnings" className="block p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-white/10 hover:border-green-500/30 hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-500/15 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-white/90 text-sm">Mes Revenus</h3>
              <p className="text-xs text-white/50">Historique des gains, stats mensuelles et previsions</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-white/50 group-hover:text-green-600 transition-colors" />
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[
          { label: 'Trouver une tache', href: '/tasks', icon: Search, color: 'text-[#E50914]', bg: 'bg-white/[0.04]' },
          { label: 'Decouvrir les films', href: '/films', icon: Clapperboard, color: 'text-blue-500', bg: 'bg-white/[0.04]' },
          { label: 'Voir le streaming', href: '/streaming', icon: PlayCircle, color: 'text-red-500', bg: 'bg-white/[0.04]' },
          { label: 'Investir', href: '/tokenization', icon: PiggyBank, color: 'text-green-500', bg: 'bg-white/[0.04]' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-3 p-4 sm:p-6 rounded-xl ${action.bg} border border-white/10/60 hover:border-white/15 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all min-h-[52px] sm:min-h-[60px] group`}
          >
            <action.icon className={`h-5 w-5 shrink-0 ${action.color}`} />
            <span className="text-white/60 text-sm font-medium group-hover:text-white/90 transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Launch Checklist -- Admin Only */}
      {isAdmin && (
        <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10/60 overflow-hidden">
          <div className="p-4 sm:p-7 pb-4 sm:pb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#E50914]/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-[#E50914]" />
              </div>
              <div>
                <h2 className="text-white text-lg font-bold font-[family-name:var(--font-playfair)]">
                  Checklist de Lancement
                </h2>
                <p className="text-white/50 text-xs mt-0.5">
                  Actions requises avant la mise en production
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-7 pb-4 sm:pb-7">
            <div className="space-y-3">
              {([
                {
                  title: 'Creer une entite legale en Israel (Ltd)',
                  icon: Building2,
                  helper: 'HUMAN',
                  needsAttention: true,
                  link: 'https://www.gov.il/en/departments/topics/companies-registrar',
                },
                {
                  title: 'Ouvrir un compte bancaire professionnel',
                  icon: Landmark,
                  helper: 'HUMAN',
                  needsAttention: true,
                },
                {
                  title: 'Configurer Stripe Connect pour les paiements',
                  icon: CreditCard,
                  helper: 'CLAUDE',
                  needsAttention: true,
                },
                {
                  title: 'Obtenir les cles API (Claude, ElevenLabs, Runway)',
                  icon: Key,
                  helper: 'CLAUDE',
                  needsAttention: true,
                },
                {
                  title: 'Souscrire a un KYC provider (Sumsub)',
                  icon: ShieldCheck,
                  helper: 'BOTH',
                  needsAttention: true,
                },
                {
                  title: 'Demander le sandbox ISA pour les tokens',
                  icon: Scale,
                  helper: 'HUMAN',
                  needsAttention: true,
                },
                {
                  title: 'Domaine + Cloudflare',
                  icon: Globe,
                  helper: 'CLAUDE',
                  needsAttention: false,
                },
                {
                  title: 'Deployer sur Coolify/Hetzner',
                  icon: Server,
                  helper: 'CLAUDE',
                  needsAttention: false,
                },
              ] as const).map((item) => (
                <div
                  key={item.title}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors duration-200 group"
                >
                  <Square className={`h-4 w-4 shrink-0 ${item.needsAttention ? 'text-[#E50914]/60' : 'text-white/30'}`} />
                  <item.icon className={`h-4 w-4 shrink-0 ${item.needsAttention ? 'text-[#E50914]' : 'text-white/50'}`} />
                  <span className={`text-sm flex-1 min-w-0 ${item.needsAttention ? 'text-white/80' : 'text-white/50'}`}>
                    {item.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1.5 py-0 h-4 shrink-0 ${
                      item.helper === 'CLAUDE'
                        ? 'border-purple-500/30 text-purple-400'
                        : item.helper === 'HUMAN'
                        ? 'border-orange-500/30 text-orange-400'
                        : 'border-blue-500/30 text-blue-400'
                    }`}
                  >
                    {item.helper === 'CLAUDE' ? 'Claude' : item.helper === 'HUMAN' ? 'Humain' : 'Les deux'}
                  </Badge>
                  {'link' in item && item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E50914]/50 hover:text-[#E50914] transition-colors sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
