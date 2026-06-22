import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import {
  Video, Clock, CheckCircle2, XCircle, AlertCircle, Loader2,
  Activity, Settings2, Layers, Zap, ArrowLeft,
  Film, ChevronRight,
} from 'lucide-react'
import {
  listTranscodeJobsAction,
  getTranscodeQueueStatsAction,
} from '@/app/actions/transcoding'
import {
  getBitrateProfilesAction,
} from '@/app/actions/bitrate-config'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Transcoding' }

// ─── Helpers ─────────────────────────────────────────────────────────────────

type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

function statusBadgeVariant(status: JobStatus): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' {
  switch (status) {
    case 'PENDING': return 'secondary'
    case 'PROCESSING': return 'default'
    case 'COMPLETED': return 'success'
    case 'FAILED': return 'destructive'
    case 'CANCELLED': return 'warning'
  }
}

function statusLabel(status: JobStatus): string {
  switch (status) {
    case 'PENDING': return 'En attente'
    case 'PROCESSING': return 'En cours'
    case 'COMPLETED': return 'Terminé'
    case 'FAILED': return 'Échoué'
    case 'CANCELLED': return 'Annulé'
  }
}

function statusIcon(status: JobStatus) {
  switch (status) {
    case 'PENDING': return <Clock className="h-4 w-4 text-white/40" />
    case 'PROCESSING': return <Loader2 className="h-4 w-4 text-[#E50914] animate-spin" />
    case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-green-400" />
    case 'FAILED': return <XCircle className="h-4 w-4 text-red-400" />
    case 'CANCELLED': return <AlertCircle className="h-4 w-4 text-yellow-400" />
  }
}

function formatDate(d: Date | string | undefined): string {
  if (!d) return '—'
  const date = d instanceof Date ? d : new Date(d)
  return date.toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatDuration(start?: Date | string, end?: Date | string): string {
  if (!start || !end) return '—'
  const s = start instanceof Date ? start : new Date(start)
  const e = end instanceof Date ? end : new Date(end)
  const secs = Math.round((e.getTime() - s.getTime()) / 1000)
  if (secs < 60) return `${secs}s`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ${secs % 60}s`
  return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminTranscodingPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  // Fetch all data in parallel
  const [statsResult, allJobsResult, profilesResult] = await Promise.all([
    getTranscodeQueueStatsAction(),
    listTranscodeJobsAction(),
    getBitrateProfilesAction(),
  ])

  const stats = 'data' in statsResult ? statsResult.data : null
  const allJobs = ('data' in allJobsResult ? allJobsResult.data : []) || []
  const profiles = profilesResult.profiles ?? []

  const activeJobs = allJobs.filter((j) => j.status === 'PROCESSING')
  const pendingJobs = allJobs.filter((j) => j.status === 'PENDING')
  const completedJobs = allJobs.filter((j) => j.status === 'COMPLETED')
  const failedJobs = allJobs.filter((j) => j.status === 'FAILED')
  const cancelledJobs = allJobs.filter((j) => j.status === 'CANCELLED')

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Link href="/admin" className="text-white/40 hover:text-white/70 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Video className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
                Transcoding
              </h1>
              <p className="text-white/40 text-xs">Queue de transcodage vidéo & configuration des bitrates</p>
            </div>
          </div>
        </div>
        <Link href="/admin/films">
          <Button variant="outline" size="sm" className="gap-2">
            <Film className="h-4 w-4" />
            Gérer les films
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Queue Stats KPIs */}
      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'En attente', value: stats.pending, icon: Clock, color: 'text-white/60', bg: 'bg-white/5' },
            { label: 'En cours', value: stats.processing, icon: Activity, color: 'text-[#E50914]', bg: 'bg-[#E50914]/10' },
            { label: 'Terminés', value: stats.completed, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'Échoués', value: stats.failed, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Annulés', value: stats.cancelled, icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          ].map((kpi) => (
            <Card key={kpi.label} className={`${kpi.bg} border-white/5`}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  <div>
                    <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                    <p className="text-white/40 text-xs">{kpi.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
          <AlertCircle className="h-4 w-4 text-yellow-400 shrink-0" />
          <p className="text-yellow-400 text-sm">Impossible de charger les statistiques de la queue.</p>
        </div>
      )}

      {/* Total job count */}
      {stats && (
        <p className="text-white/30 text-xs -mt-6">
          {stats.total} job{stats.total !== 1 ? 's' : ''} au total dans la queue
        </p>
      )}

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-[#E50914]" />
            <h2 className="text-white font-semibold">Jobs en cours ({activeJobs.length})</h2>
          </div>
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <Card key={job.id} className="border-[#E50914]/20 bg-[#E50914]/5">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {statusIcon(job.status as JobStatus)}
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate">{job.filmTitle}</p>
                        <p className="text-white/40 text-[10px] font-mono truncate">{job.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {job.profiles.map((p) => (
                        <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-mono">
                          {p}
                        </span>
                      ))}
                    </div>
                    <Badge variant={statusBadgeVariant(job.status as JobStatus)} className="shrink-0 text-[10px]">
                      {statusLabel(job.status as JobStatus)}
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white/50 text-xs">Progression</span>
                      <span className="text-white/70 text-xs font-medium">{job.progress}%</span>
                    </div>
                    <Progress value={job.progress} className="h-1.5" />
                  </div>
                  <p className="text-white/30 text-[10px] mt-2">
                    Démarré : {formatDate(job.startedAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Jobs */}
      {pendingJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-white/50" />
            <h2 className="text-white font-semibold">En attente ({pendingJobs.length})</h2>
          </div>
          <div className="space-y-2">
            {pendingJobs.map((job) => (
              <Card key={job.id} className="border-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {statusIcon(job.status as JobStatus)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm truncate">{job.filmTitle}</p>
                      <p className="text-white/30 text-[10px] font-mono">{job.id}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {job.profiles.map((p) => (
                        <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-mono">
                          {p}
                        </span>
                      ))}
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">En attente</Badge>
                    <p className="text-white/30 text-[10px] w-full sm:w-auto">
                      Créé : {formatDate(job.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <h2 className="text-white font-semibold">Terminés ({completedJobs.length})</h2>
          </div>
          <div className="space-y-2">
            {completedJobs.map((job) => (
              <Card key={job.id} className="border-white/5 bg-white/[0.02]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {statusIcon(job.status as JobStatus)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-sm truncate">{job.filmTitle}</p>
                      <p className="text-white/20 text-[10px] font-mono">{job.id}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      {job.profiles.map((p) => (
                        <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400/70 font-mono">
                          {p}
                        </span>
                      ))}
                    </div>
                    <Badge variant="success" className="shrink-0 text-[10px]">Terminé</Badge>
                    <div className="text-white/30 text-[10px] w-full sm:w-auto flex items-center gap-2">
                      <span>Durée : {formatDuration(job.startedAt, job.completedAt)}</span>
                      <span>·</span>
                      <span>{formatDate(job.completedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Failed Jobs */}
      {failedJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-4 w-4 text-red-400" />
            <h2 className="text-white font-semibold">Échoués ({failedJobs.length})</h2>
          </div>
          <div className="space-y-2">
            {failedJobs.map((job) => (
              <Card key={job.id} className="border-red-500/10 bg-red-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {statusIcon(job.status as JobStatus)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm truncate">{job.filmTitle}</p>
                      <p className="text-white/30 text-[10px] font-mono">{job.id}</p>
                    </div>
                    <Badge variant="destructive" className="shrink-0 text-[10px]">Échoué</Badge>
                  </div>
                  {job.error && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/15">
                      <p className="text-red-400 text-xs font-mono break-all">{job.error}</p>
                    </div>
                  )}
                  <p className="text-white/30 text-[10px] mt-2">{formatDate(job.completedAt)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Jobs (collapsed summary) */}
      {cancelledJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <h2 className="text-white font-semibold">Annulés ({cancelledJobs.length})</h2>
          </div>
          <div className="space-y-2">
            {cancelledJobs.map((job) => (
              <Card key={job.id} className="border-white/5 opacity-60">
                <CardContent className="p-3 flex items-center gap-3">
                  {statusIcon(job.status as JobStatus)}
                  <span className="text-white/50 text-sm flex-1 truncate">{job.filmTitle}</span>
                  <span className="text-white/20 text-[10px] font-mono hidden sm:block">{job.id}</span>
                  <Badge variant="warning" className="shrink-0 text-[10px]">Annulé</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {allJobs.length === 0 && (
        <Card className="border-white/5">
          <CardContent className="py-16 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-5">
              <Video className="h-7 w-7 text-white/20" />
            </div>
            <p className="text-white/60 font-semibold mb-1">Queue vide</p>
            <p className="text-white/30 text-sm max-w-xs">
              Aucun job de transcodage en cours ou planifié. Lancez un transcodage depuis la fiche d'un film.
            </p>
            <Link href="/admin/films" className="mt-6">
              <Button variant="outline" size="sm" className="gap-2">
                <Film className="h-4 w-4" /> Voir les films
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Bitrate Profiles Reference */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Settings2 className="h-4 w-4 text-orange-400" />
          <h2 className="text-white font-semibold">Profils de bitrate disponibles</h2>
        </div>
        {profiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {profiles.map((profile) => (
              <Card key={profile.key} className="border-white/5 bg-white/[0.02]">
                <CardHeader className="pb-2 p-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-mono text-orange-400">{profile.key}</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">{profile.label}</Badge>
                  </div>
                  <CardDescription className="text-xs">{profile.resolution}</CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs flex items-center gap-1.5">
                      <Layers className="h-3 w-3" /> Vidéo
                    </span>
                    <span className="text-white/70 text-xs font-mono">{profile.videoBitrate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs flex items-center gap-1.5">
                      <Zap className="h-3 w-3" /> Audio
                    </span>
                    <span className="text-white/70 text-xs font-mono">{profile.audioBitrate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">FPS max</span>
                    <span className="text-white/70 text-xs font-mono">{profile.maxFramerate} fps</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-white/5">
            <CardContent className="py-8 text-center">
              <p className="text-white/30 text-sm">Impossible de charger les profils de bitrate.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Available Quality Profiles from stats */}
      {stats && 'availableProfiles' in stats && Array.isArray(stats.availableProfiles) && stats.availableProfiles.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Video className="h-4 w-4 text-white/50" />
            <h2 className="text-white font-semibold text-sm">Profils actifs dans la queue</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {(stats.availableProfiles as Array<{ key: string; label: string; resolution: string; bitrate: string }>).map((p) => (
              <div
                key={p.key}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="text-[#E50914] text-xs font-mono font-semibold">{p.key}</span>
                <span className="text-white/40 text-xs">{p.label}</span>
                <span className="text-white/20 text-[10px]">{p.resolution}</span>
                <span className="text-white/30 text-[10px] font-mono">{p.bitrate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
