import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus, Film, Clock, CheckCircle2, Loader2, Sparkles,
  ChevronRight, Wand2, Trophy, Coins, ArrowRight,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Studio Bande-Annonce — CINEGENY',
  description: 'Create cinematic trailers with AI',
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  DRAFT: { label: 'Draft', color: 'bg-white/[0.05] text-white/60', icon: Clock },
  DECOMPOSING: { label: 'Breaking down...', color: 'bg-blue-100 text-blue-600', icon: Loader2 },
  AWAITING_INPUT: { label: 'En attente', color: 'bg-amber-100 text-amber-600', icon: Clock },
  IN_PROGRESS: { label: 'In progress', color: 'bg-purple-100 text-purple-600', icon: Loader2 },
  COMMUNITY_VOTE: { label: 'Community vote', color: 'bg-pink-100 text-pink-600', icon: Trophy },
  ASSEMBLING: { label: 'Assemblage', color: 'bg-indigo-100 text-indigo-600', icon: Loader2 },
  REVIEW: { label: 'Verification', color: 'bg-orange-100 text-orange-600', icon: Clock },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-600', icon: CheckCircle2 },
  SUBMITTED: { label: 'Soumis au concours', color: 'bg-[#E50914]/10 text-[#E50914]', icon: Trophy },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-600', icon: Clock },
}

export default async function TrailerStudioPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const [projects, creditAccount, openContests] = await Promise.all([
    prisma.trailerProject.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    }),
    prisma.creditAccount.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.trailerContest.findMany({
      where: { status: 'OPEN' as never },
      take: 3,
      orderBy: { endDate: 'asc' },
    }),
  ])

  const creditBalance = creditAccount?.balance ?? 0

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
            Studio Bande-Annonce
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Créez des bandes-annonces cinématographiques avec l&apos;IA, de A à Z
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/credits">
            <Badge variant="outline" className="text-sm px-3 py-1.5 border-[#E50914]/20 text-[#E50914] cursor-pointer hover:bg-[#E50914]/5 transition-colors">
              <Coins className="h-3.5 w-3.5 mr-1.5" />
              {creditBalance} crédits
            </Badge>
          </Link>
          <Link href="/trailer-studio/new">
            <Button className="bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Bande-Annonce
            </Button>
          </Link>
        </div>
      </div>

      {/* Open Contests Banner */}
      {openContests.length > 0 && (
        <div className="rounded-2xl border border-[#E50914]/20 bg-gradient-to-r from-[#E50914]/5 to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-[#E50914]/10 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-[#E50914]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">
                {openContests.length} concours ouvert{openContests.length > 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Soumettez votre bande-annonce et gagnez la production de votre film avec des royalties de coproduction !
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {openContests.map((contest) => (
                  <Link key={contest.id} href={`/community/contests/${contest.id}`}>
                    <Badge variant="outline" className="text-xs cursor-pointer hover:bg-[#E50914]/10 transition-colors border-[#E50914]/30">
                      {contest.title}
                      {contest.prizePoolEur > 0 && <span className="ml-1 text-[#E50914]">{contest.prizePoolEur}€</span>}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How it works (shown when no projects) */}
      {projects.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 mb-4">
              <Wand2 className="h-8 w-8 text-[#E50914]" />
            </div>
            <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Comment ça marche ?
            </h2>
            <p className="text-sm text-white/50 mt-2 max-w-lg mx-auto">
              Notre IA décompose la création de votre bande-annonce en micro-tâches intelligentes et les exécute automatiquement.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: '1', title: 'Describe your concept', desc: 'Genre, style, mood, length — give the creative brief' },
              { step: '2', title: 'Faites vos choix', desc: 'Characters, sets, music — AI suggests, you choose' },
              { step: '3', title: 'AI generates everything', desc: 'Every scene, every shot, every sound is created by AI' },
              { step: '4', title: 'Soumettez au concours', desc: 'Participez et gagnez la production de votre film !' },
            ].map((item) => (
              <div key={item.step} className="relative rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-[#E50914] text-white text-xs font-bold flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-white mt-1">{item.title}</h3>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/trailer-studio/new">
              <Button size="lg" className="bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold shadow-md">
                <Sparkles className="h-4 w-4 mr-2" />
                Créer ma première bande-annonce
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Mes projets</h2>
          <div className="grid gap-4">
            {projects.map((project) => {
              const statusInfo = STATUS_CONFIG[project.status] || STATUS_CONFIG.DRAFT
              const StatusIcon = statusInfo.icon
              return (
                <Link
                  key={project.id}
                  href={`/trailer-studio/${project.id}`}
                  className="group rounded-xl border border-white/10 bg-white/5 hover:border-[#E50914]/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#E50914]/10 flex items-center justify-center shrink-0 group-hover:bg-[#E50914]/15 transition-colors">
                      <Film className="h-6 w-6 text-[#E50914]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#E50914] transition-colors">
                          {project.title}
                        </h3>
                        <Badge className={`text-[10px] px-2 py-0.5 ${statusInfo.color} border-0`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-white/50">
                        {project.genre && <span>{project.genre}</span>}
                        {project.style && <span>{project.style}</span>}
                        <span>{project.completedTasks}/{project.totalTasks} tâches</span>
                        {project.creditsUsed > 0 && (
                          <span className="text-[#E50914]">{project.creditsUsed} crédits</span>
                        )}
                      </div>
                      {/* Progress bar */}
                      {project.totalTasks > 0 && (
                        <div className="mt-2 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] transition-all duration-500"
                            style={{ width: `${project.progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/50 group-hover:text-[#E50914] transition-colors shrink-0" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/credits" className="group rounded-xl border border-white/10 bg-white/5 hover:border-[#E50914]/30 p-5 transition-all">
          <div className="flex items-center gap-3">
            <Coins className="h-5 w-5 text-[#E50914]" />
            <div>
              <p className="text-sm font-medium text-white group-hover:text-[#E50914] transition-colors">Buy credits</p>
              <p className="text-xs text-white/50">Packs à partir de 4.99€</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/50 ml-auto group-hover:text-[#E50914] transition-colors" />
          </div>
        </Link>
        <Link href="/community/contests" className="group rounded-xl border border-white/10 bg-white/5 hover:border-[#E50914]/30 p-5 transition-all">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-[#E50914]" />
            <div>
              <p className="text-sm font-medium text-white group-hover:text-[#E50914] transition-colors">Concours ouverts</p>
              <p className="text-xs text-white/50">Gagnez la prod de votre film</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/50 ml-auto group-hover:text-[#E50914] transition-colors" />
          </div>
        </Link>
        <Link href="/films" className="group rounded-xl border border-white/10 bg-white/5 hover:border-[#E50914]/30 p-5 transition-all">
          <div className="flex items-center gap-3">
            <Film className="h-5 w-5 text-[#E50914]" />
            <div>
              <p className="text-sm font-medium text-white group-hover:text-[#E50914] transition-colors">Nos films</p>
              <p className="text-xs text-white/50">Inspirez-vous du catalogue</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white/50 ml-auto group-hover:text-[#E50914] transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )
}
