import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/utils'
import { toggleFundingStepAction, updateFundingStatusAction } from '@/app/actions/funding'
import {
  Landmark, CheckCircle, Clock, FileText, AlertTriangle,
  Building2, Banknote, ExternalLink, ChevronDown,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Aides Publiques' }

const statusColors: Record<string, string> = {
  NOT_STARTED: 'bg-white/[0.03]0/10 text-white/50 border-gray-500/20',
  ELIGIBLE: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  SUBMITTED: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  ACCEPTED: 'bg-green-500/10 text-green-600 border-green-500/20',
  REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
  EXPIRED: 'bg-white/[0.03]0/10 text-white/50 border-gray-500/20',
}

const statusLabels: Record<string, string> = {
  NOT_STARTED: 'Non démarré',
  ELIGIBLE: 'Éligible',
  IN_PROGRESS: 'En cours',
  SUBMITTED: 'Dossier déposé',
  ACCEPTED: 'Obtenu',
  REJECTED: 'Refusé',
  EXPIRED: 'Expiré',
}

const typeLabels: Record<string, string> = {
  SUBVENTION: 'Subvention',
  AVANCE: 'Avance remboursable',
  PRET: 'Prêt',
  CREDIT_IMPOT: 'Crédit d\'impôt',
  GARANTIE: 'Garantie',
  CONCOURS: 'Concours',
}

const typeIcons: Record<string, string> = {
  SUBVENTION: '🎁',
  AVANCE: '🔄',
  PRET: '🏦',
  CREDIT_IMPOT: '💰',
  GARANTIE: '🛡️',
  CONCOURS: '🏆',
}

export default async function AdminFundingPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const fundings = await prisma.publicFunding.findMany({
    include: { steps: { orderBy: { order: 'asc' } } },
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
  })

  const preCompanyFundings = fundings.filter(f => f.preCompany)
  const postCompanyFundings = fundings.filter(f => f.postCompany && !f.preCompany)
  const allFundings = fundings

  // Stats
  const totalPotential = fundings.reduce((s, f) => s + (f.maxAmount || 0), 0)
  const accepted = fundings.filter(f => f.status === 'ACCEPTED')
  const totalObtained = accepted.reduce((s, f) => s + (f.maxAmount || 0), 0)
  const inProgress = fundings.filter(f => f.status === 'IN_PROGRESS' || f.status === 'SUBMITTED')
  const totalSteps = fundings.reduce((s, f) => s + f.steps.length, 0)
  const completedSteps = fundings.reduce((s, f) => s + f.steps.filter(st => st.completed).length, 0)

  const stats = [
    { label: 'Montant potentiel', value: formatPrice(totalPotential), icon: Banknote, color: 'text-green-600' },
    { label: 'Montant obtenu', value: formatPrice(totalObtained), icon: CheckCircle, color: 'text-[#E50914]' },
    { label: 'Dossiers en cours', value: inProgress.length.toString(), icon: Clock, color: 'text-blue-600' },
    { label: 'Progression globale', value: totalSteps > 0 ? `${Math.round((completedSteps / totalSteps) * 100)}%` : '0%', icon: FileText, color: 'text-purple-600' },
  ]

  function renderFundingCard(f: typeof fundings[0]) {
    const stepsCompleted = f.steps.filter(s => s.completed).length
    const progressPct = f.steps.length > 0 ? (stepsCompleted / f.steps.length) * 100 : 0

    return (
      <Card key={f.id} className="hover:border-white/10 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-lg">{typeIcons[f.type] || '📋'}</span>
                <h3 className="font-semibold text-lg">{f.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[f.status]}`}>
                  {statusLabels[f.status]}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/40 mb-2">
                <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{f.organism}</span>
                <span>·</span>
                <span>{typeLabels[f.type]}</span>
                {f.maxAmount && (
                  <>
                    <span>·</span>
                    <span className="text-[#E50914] font-medium">Jusqu&apos;à {formatPrice(f.maxAmount)}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-white/50 line-clamp-2">{f.description}</p>
            </div>

            {/* Status change */}
            <form action={updateFundingStatusAction} className="shrink-0">
              <input type="hidden" name="fundingId" value={f.id} />
              <div className="relative">
                <select
                  name="status"
                  defaultValue={f.status}
                  className="appearance-none bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 pr-8 text-xs text-white/70 cursor-pointer"
                >
                  {Object.entries(statusLabels).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <Button type="submit" size="sm" variant="outline" className="text-xs h-7 ml-1">OK</Button>
                <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              </div>
            </form>
          </div>

          {/* Eligibility */}
          <div className="bg-white/[0.02] rounded-lg p-3 mb-4">
            <p className="text-xs font-medium text-white/40 mb-1">Éligibilité</p>
            <p className="text-sm text-white/60">{f.eligibility}</p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            {f.preCompany && (
              <Badge variant="outline" className="text-[10px] border-blue-500/20 text-blue-600">
                Avant création société
              </Badge>
            )}
            {f.postCompany && (
              <Badge variant="outline" className="text-[10px] border-green-500/20 text-green-600">
                Après création société
              </Badge>
            )}
            {f.applicationUrl && (
              <a href={f.applicationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-[#E50914] hover:underline">
                <ExternalLink className="h-3 w-3" /> Site officiel
              </a>
            )}
          </div>

          {/* Progress bar */}
          {f.steps.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-white/40 mb-1.5">
                <span>{stepsCompleted}/{f.steps.length} étapes</span>
                <span>{Math.round(progressPct)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Steps */}
          {f.steps.length > 0 && (
            <div className="space-y-1.5">
              {f.steps.map((step) => (
                <form key={step.id} action={toggleFundingStepAction} className="flex items-start gap-2.5 group">
                  <input type="hidden" name="stepId" value={step.id} />
                  <button
                    type="submit"
                    className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-all ${
                      step.completed
                        ? 'bg-[#E50914] border-[#E50914] text-white'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {step.completed && <CheckCircle className="h-3 w-3" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm ${step.completed ? 'text-white/30 line-through' : 'text-white/70'}`}>
                      {step.title}
                    </span>
                    {step.description && (
                      <p className="text-xs text-white/30">{step.description}</p>
                    )}
                    {step.documents.length > 0 && (
                      <div className="flex gap-1.5 mt-1">
                        {step.documents.map((doc, i) => (
                          <Badge key={i} variant="outline" className="text-[9px] border-white/10 text-white/30">
                            <FileText className="h-2.5 w-2.5 mr-0.5" />{doc}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </form>
              ))}
            </div>
          )}

          {/* Notes */}
          {f.notes && (
            <div className="mt-3 p-2.5 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
              <p className="text-xs text-yellow-600/70 flex items-center gap-1.5">
                <AlertTriangle className="h-3 w-3" /> {f.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3 font-playfair">
          <Landmark className="h-7 w-7 text-[#E50914]" /> Aides Publiques
        </h1>
        <p className="text-white/50">Suivi des aides BPI, CNC, RIAM, CIR et autres financements publics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-30`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline: Avant création société */}
      {preCompanyFundings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5" /> Avant création de la société (SAS)
          </h2>
          <div className="space-y-4 border-l-2 border-blue-500/20 pl-6 ml-3">
            {preCompanyFundings.map(renderFundingCard)}
          </div>
        </div>
      )}

      {/* Timeline: Après création société */}
      {postCompanyFundings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-green-600 flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5" /> Après création de la société
          </h2>
          <div className="space-y-4 border-l-2 border-green-500/20 pl-6 ml-3">
            {postCompanyFundings.map(renderFundingCard)}
          </div>
        </div>
      )}

      {/* Empty state */}
      {fundings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Landmark className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 mb-4">Aucune aide publique configurée</p>
            <p className="text-xs text-white/30 max-w-md mx-auto">
              Les aides publiques seront pré-remplies lors du seed de la base de données.
              Exécutez <code className="bg-white/5 px-1.5 py-0.5 rounded">npm run db:seed</code> pour démarrer.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
