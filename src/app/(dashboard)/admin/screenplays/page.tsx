import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { FileText, CheckCircle, XCircle, Film } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Scénarios' }

export default async function AdminScreenplaysPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const screenplays = await prisma.screenplay.findMany({
    include: {
      user: { select: { displayName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const statusColors: Record<string, string> = {
    SUBMITTED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    EVALUATING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    ACCEPTED: 'bg-green-500/10 text-green-600 border-green-500/20',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  const statusLabels: Record<string, string> = {
    SUBMITTED: 'Soumis',
    EVALUATING: 'En évaluation',
    ACCEPTED: 'Accepté',
    REJECTED: 'Refusé',
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 font-playfair">Scénarios</h1>
        <p className="text-white/60">{screenplays.length} scénario{screenplays.length > 1 ? 's' : ''} soumis</p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {screenplays.length === 0 ? (
        <Card className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-white/50 mx-auto mb-3" />
            <p className="text-white/50">Aucun scénario soumis</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {screenplays.map((s) => (
            <Card key={s.id} className="rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 hover:border-white/15 hover:shadow-md hover:-translate-y-[1px] transition-all duration-500">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg truncate">{s.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[s.status] || ''}`}>
                        {statusLabels[s.status] || s.status}
                      </span>
                    </div>

                    <p className="text-sm text-white/50 mb-3 line-clamp-2">{s.logline}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/50">
                      <span>par {s.user.displayName || s.user.email}</span>
                      <span>·</span>
                      <span>{s.genre || 'Genre non défini'}</span>
                      <span>·</span>
                      <span>{formatDate(s.createdAt)}</span>
                      <span>·</span>
                      <span>Tolérance modification: {s.modificationTolerance}%</span>
                      {s.revenueShareBps > 0 && (
                        <>
                          <span>·</span>
                          <span>Revenue share: {(s.revenueShareBps / 100).toFixed(1)}%</span>
                        </>
                      )}
                    </div>

                    {/* AI Score */}
                    {s.aiScore !== null && (
                      <div className="mt-3 flex items-center gap-3">
                        <div className={`text-sm font-bold ${
                          (s.aiScore || 0) >= 80 ? 'text-green-600' :
                          (s.aiScore || 0) >= 50 ? 'text-[#E50914]' :
                          'text-red-400'
                        }`}>
                          Score IA: {s.aiScore}/100
                        </div>
                        {s.aiFeedback && (
                          <p className="text-xs text-white/50 truncate flex-1">{s.aiFeedback}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                    {s.status === 'ACCEPTED' ? (
                      <Badge variant="outline" className="justify-center border-green-500/20 text-green-600">
                        <Film className="h-3 w-3 mr-1" /> Accepté
                      </Badge>
                    ) : s.status !== 'REJECTED' ? (
                      <>
                        <form action={async () => {
                          'use server'
                          await prisma.screenplay.update({ where: { id: s.id }, data: { status: 'ACCEPTED' } })
                          const { redirect: redir } = await import('next/navigation')
                          redir('/admin/screenplays')
                        }}>
                          <Button type="submit" size="sm" className="w-full gap-1">
                            <CheckCircle className="h-4 w-4" /> Accepter
                          </Button>
                        </form>
                        <form action={async () => {
                          'use server'
                          await prisma.screenplay.update({ where: { id: s.id }, data: { status: 'REJECTED' } })
                          const { redirect: redir } = await import('next/navigation')
                          redir('/admin/screenplays')
                        }}>
                          <Button type="submit" size="sm" variant="outline" className="text-red-400 border-red-500/20 gap-1">
                            <XCircle className="h-4 w-4" /> Refuser
                          </Button>
                        </form>
                      </>
                    ) : (
                      <Badge variant="outline" className="justify-center border-red-500/20 text-red-400">
                        <XCircle className="h-3 w-3 mr-1" /> Refusé
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
