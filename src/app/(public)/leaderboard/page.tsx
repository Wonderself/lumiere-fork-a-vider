import { prisma } from '@/lib/prisma'
import { getCached } from '@/lib/redis'
import { Trophy, Star, Medal, Crown, Zap, Film } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Classement — CINEGENY',
  description: 'Les meilleurs contributeurs de la plateforme CINEGENY.',
}

async function getLeaderboard() {
  return getCached('leaderboard:top50', async () => {
    try {
      return await prisma.user.findMany({
        where: { isVerified: true },
        select: {
          id: true,
          displayName: true,
          level: true,
          points: true,
          tasksCompleted: true,
          tasksValidated: true,
          role: true,
        },
        orderBy: [{ points: 'desc' }, { tasksCompleted: 'desc' }],
        take: 50,
      })
    } catch {
      return []
    }
  }, 120) // 2 min cache
}

async function getStats() {
  return getCached('leaderboard:stats', async () => {
    try {
      const [totalUsers, totalTasks, totalPaid] = await Promise.all([
        prisma.user.count({ where: { isVerified: true } }),
        prisma.task.count({ where: { status: 'VALIDATED' } }),
        prisma.payment.aggregate({
          _sum: { amountEur: true },
          where: { status: 'COMPLETED' },
        }),
      ])
      return { totalUsers, totalTasks, totalPaid: totalPaid._sum.amountEur || 0 }
    } catch {
      return { totalUsers: 0, totalTasks: 0, totalPaid: 0 }
    }
  }, 300) // 5 min cache
}

const LEVEL_COLORS: Record<string, string> = {
  ROOKIE: 'text-gray-400',
  PRO: 'text-blue-500',
  EXPERT: 'text-[#E50914]',
  VIP: 'text-purple-500',
}

const LEVEL_LABELS: Record<string, string> = {
  ROOKIE: 'Rookie',
  PRO: 'Pro',
  EXPERT: 'Expert',
  VIP: 'VIP',
}

export default async function LeaderboardPage() {
  const [users, stats] = await Promise.all([getLeaderboard(), getStats()])

  const top3 = users.slice(0, 3)
  const rest = users.slice(3)

  return (
    <div className="min-h-screen">
      {/* ================================================================ */}
      {/* HERO SECTION                                                     */}
      {/* ================================================================ */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
        {/* Ambient blur circles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#E50914]/[0.05] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/3 w-72 h-72 bg-[#E50914]/[0.06] rounded-full blur-[100px]" />
          {/* Gold particles */}
          <div className="absolute top-[20%] left-[25%] w-1 h-1 rounded-full bg-[#E50914]/40 animate-pulse" />
          <div className="absolute top-[30%] right-[20%] w-1.5 h-1.5 rounded-full bg-[#E50914]/30 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute top-[55%] left-[10%] w-1 h-1 rounded-full bg-[#E50914]/25 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[45%] right-[30%] w-1 h-1 rounded-full bg-[#E50914]/30 animate-pulse [animation-delay:1.5s]" />
        </div>

        <div className="relative container mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] text-sm mb-6">
            <Trophy className="h-4 w-4" />
            <span className="font-medium">Hall of Fame</span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 text-white"
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #E50914 0%, #FF2D2D 40%, #E50914 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Classement
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-12">
            Les meilleurs contributeurs de la plateforme
          </p>

          {/* Global stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Contributeurs actifs', value: stats.totalUsers, icon: Star, color: 'text-[#E50914]' },
              { label: 'Taches validees', value: stats.totalTasks, icon: Zap, color: 'text-green-500' },
              { label: 'Revenus distribues', value: formatPrice(stats.totalPaid), icon: Film, color: 'text-purple-500' },
            ].map((s) => (
              <div key={s.label} className="text-center p-5 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.03] transition-all duration-500">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 mx-auto mb-2">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom separator */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </section>

      {/* ================================================================ */}
      {/* PODIUM & TABLE                                                   */}
      {/* ================================================================ */}
      <div className="relative px-4 pb-16">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="container mx-auto max-w-4xl">
          {users.length === 0 ? (
            <div className="text-center py-24 text-white/40">
              <Trophy className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl text-white/50">Aucun classement disponible</p>
              <p className="text-sm mt-2 text-white/40">Soyez le premier a contribuer !</p>
            </div>
          ) : (
            <>
              {/* Top 3 podium */}
              {top3.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 sm:items-end">
                  {/* 1st place — shown first on mobile, centered on desktop */}
                  <div className="flex flex-col items-center p-6 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#E50914]/30 bg-[#E50914]/[0.04] sm:order-2 hover-lift transition-all duration-500">
                    <div className="mb-3">
                      <Crown className="h-7 w-7 text-[#E50914]" />
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E50914]/20 to-amber-200/40 flex items-center justify-center text-2xl font-bold text-[#E50914] mb-2 ring-2 ring-[#E50914]/30">
                      {top3[0].displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <p className="font-semibold text-sm text-white truncate w-full text-center mb-1">
                      {top3[0].displayName}
                    </p>
                    <span className={`text-xs font-medium mb-2 ${LEVEL_COLORS[top3[0].level]}`}>
                      {LEVEL_LABELS[top3[0].level]}
                    </span>
                    <p className="text-2xl font-bold text-[#E50914]">{top3[0].points.toLocaleString()}</p>
                    <p className="text-xs text-white/40">points</p>
                  </div>

                  {/* 2nd place */}
                  {top3[1] ? (
                    <div className="flex flex-col items-center p-6 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.03] sm:mt-8 sm:order-1 hover-lift transition-all duration-500">
                      <div className="mb-3">
                        <Medal className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/10 to-white/20 flex items-center justify-center text-xl font-bold text-white/60 mb-2">
                        {top3[1].displayName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <p className="font-semibold text-sm text-white truncate w-full text-center mb-1">
                        {top3[1].displayName}
                      </p>
                      <span className={`text-xs font-medium mb-2 ${LEVEL_COLORS[top3[1].level]}`}>
                        {LEVEL_LABELS[top3[1].level]}
                      </span>
                      <p className="text-lg font-bold text-white">{top3[1].points.toLocaleString()}</p>
                      <p className="text-xs text-white/40">points</p>
                    </div>
                  ) : <div className="sm:order-1" />}

                  {/* 3rd place */}
                  {top3[2] ? (
                    <div className="flex flex-col items-center p-6 sm:p-5 rounded-2xl sm:rounded-3xl border border-amber-500/20 bg-amber-500/[0.06] sm:mt-16 sm:order-3 hover-lift transition-all duration-500">
                      <div className="mb-3">
                        <Medal className="h-6 w-6 text-amber-400" />
                      </div>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/30 flex items-center justify-center text-xl font-bold text-amber-400 mb-2">
                        {top3[2].displayName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <p className="font-semibold text-sm text-white truncate w-full text-center mb-1">
                        {top3[2].displayName}
                      </p>
                      <span className={`text-xs font-medium mb-2 ${LEVEL_COLORS[top3[2].level]}`}>
                        {LEVEL_LABELS[top3[2].level]}
                      </span>
                      <p className="text-lg font-bold text-white">{top3[2].points.toLocaleString()}</p>
                      <p className="text-xs text-white/40">points</p>
                    </div>
                  ) : <div className="sm:order-3" />}
                </div>
              )}

              {/* Visual separator */}
              {rest.length > 0 && (
                <div className="relative mb-10">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                  <div className="absolute left-1/2 -translate-x-1/2 -top-3 px-4 bg-[#0A0A0A]">
                    <span className="text-xs text-white/40 uppercase tracking-widest">Classement complet</span>
                  </div>
                </div>
              )}

              {/* Rest of ranking */}
              {rest.length > 0 && (
                <div className="space-y-2">
                  {rest.map((user, idx) => (
                    <a
                      key={user.id}
                      href={`/users/${user.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:border-[#E50914]/20 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer"
                    >
                      <div className="w-8 text-center text-sm font-bold text-white/40 shrink-0">
                        #{idx + 4}
                      </div>

                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/[0.06] to-white/10 flex items-center justify-center text-sm font-bold text-white/60 shrink-0">
                        {user.displayName?.[0]?.toUpperCase() || '?'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-sm text-white truncate">{user.displayName}</p>
                          <span className={`text-xs ${LEVEL_COLORS[user.level]}`}>
                            {LEVEL_LABELS[user.level]}
                          </span>
                        </div>
                        <p className="text-xs text-white/40">
                          {user.tasksCompleted} tache{user.tasksCompleted > 1 ? 's' : ''} validee{user.tasksCompleted > 1 ? 's' : ''}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold text-white">
                          {user.points.toLocaleString()}
                        </div>
                        <div className="text-xs text-white/40">points</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <div className="mt-16 text-center p-8 rounded-2xl sm:rounded-3xl border border-[#E50914]/20 bg-[#E50914]/[0.03] relative overflow-hidden transition-all duration-500">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-[#E50914]/[0.05] rounded-full blur-[60px]" />
            </div>
            <div className="relative">
              <h2 className="text-2xl font-bold mb-2 text-white font-playfair">
                Rejoignez le classement
              </h2>
              <p className="text-white/50 mb-6 text-sm">
                Completez des taches, gagnez des points, progressez dans les niveaux.
              </p>
              <a
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E50914] text-white font-semibold hover:bg-[#C4A030] transition-colors"
              >
                <Star className="h-4 w-4" />
                Commencer a contribuer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
