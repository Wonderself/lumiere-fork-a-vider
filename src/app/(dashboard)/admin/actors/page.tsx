import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Edit, Trash2, Eye, Film, UserCheck } from 'lucide-react'
import { ACTOR_STYLE_LABELS } from '@/lib/constants'
import { formatFollowers, getNationalityFlag } from '@/lib/actors'
import { deleteActorAction } from '@/app/actions/actors'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Acteurs IA' }

const STYLE_COLORS: Record<string, string> = {
  DRAMATIC: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  COMEDY: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  ACTION: 'border-red-500/30 bg-red-500/10 text-red-400',
  VERSATILE: 'border-[#E50914]/30 bg-[#E50914]/10 text-[#E50914]',
  HORROR: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  ROMANCE: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
  EXPERIMENTAL: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
}

export default async function AdminActorsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [actors, totalCastRoles, activeCount] = await Promise.all([
    prisma.aIActor.findMany({
      include: {
        _count: { select: { castRoles: true, bonusContent: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.filmCastRole.count(),
    prisma.aIActor.count({ where: { isActive: true } }),
  ])

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-playfair">
            Acteurs IA
          </h1>
          <p className="text-white/50">Gerez les acteurs virtuels de la plateforme.</p>
        </div>
        <Link href="/admin/actors/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Nouvel Acteur
          </Button>
        </Link>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total acteurs', value: actors.length, icon: Users, color: 'text-[#E50914]' },
          { label: 'Actifs', value: activeCount, icon: UserCheck, color: 'text-green-400' },
          { label: 'Roles attribues', value: totalCastRoles, icon: Film, color: 'text-blue-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-white font-playfair">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Actors List */}
      {actors.length === 0 ? (
        <div className="text-center py-20 text-white/50">
          <Users className="h-16 w-16 mx-auto mb-4 opacity-40" />
          <p className="text-xl">Aucun acteur</p>
          <p className="text-sm mt-2">Creez votre premier acteur IA.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {actors.map((actor) => (
            <div
              key={actor.id}
              className="flex items-center gap-4 p-4 sm:rounded-2xl rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:shadow-md hover:-translate-y-[1px] transition-all duration-500"
            >
              {/* Avatar */}
              <div className="h-14 w-14 rounded-full border-2 border-[#E50914]/20 bg-gradient-to-br from-[#E50914]/10 to-purple-900/20 shrink-0 overflow-hidden">
                {actor.avatarUrl ? (
                  <img
                    src={actor.avatarUrl}
                    alt={actor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#E50914]/40 text-lg font-bold font-playfair">
                    {actor.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{actor.name}</h3>
                  {actor.isActive ? (
                    <Badge variant="success">Actif</Badge>
                  ) : (
                    <Badge variant="secondary">Inactif</Badge>
                  )}
                  <Badge className={`text-[10px] ${STYLE_COLORS[actor.style] || STYLE_COLORS.VERSATILE}`}>
                    {ACTOR_STYLE_LABELS[actor.style as keyof typeof ACTOR_STYLE_LABELS]}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/50 flex-wrap">
                  <span className="font-mono text-white/50">{actor.slug}</span>
                  <span>
                    {actor.nationality && (
                      <>
                        {getNationalityFlag(actor.nationality)} {actor.nationality}
                      </>
                    )}
                  </span>
                  <span>{actor.filmCount} films</span>
                  <span>{actor._count.castRoles} roles</span>
                  <span>{formatFollowers(actor.socialFollowers)} fans</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/actors/${actor.slug}`} target="_blank">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/admin/actors/${actor.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> Editer
                  </Button>
                </Link>
                <form action={deleteActorAction}>
                  <input type="hidden" name="actorId" value={actor.id} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                    type="submit"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
