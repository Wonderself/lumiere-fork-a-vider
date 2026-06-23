'use client'

import { useActionState, useState } from 'react'
import { useEffect } from 'react'
import type { Metadata } from 'next'
import { submitBookForAdaptationAction } from '@/app/actions/book-to-screen'
import {
  BookOpen,
  User,
  FileText,
  Film,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Hash,
  MessageSquare,
  Building,
  ChevronRight,
  ArrowLeft,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
} from 'lucide-react'
import Link from 'next/link'

// Note: metadata must be in a server component; kept here as a reference comment.
// The page title is set via document.title on mount for this 'use client' page.

const GENRES = [
  'Thriller',
  'Science-Fiction',
  'Drame',
  'Romance',
  'Comedy',
  'Action',
  'Horreur',
  'Fantasy',
  'Biopic',
  'Documentaire',
  'Animation',
  'Aventure',
  'Histoire',
  'Policier',
  'Autre',
]

type ActionState = {
  error?: string
  success?: boolean
  analysis?: {
    score: number
    visualPotential: number
    dialogueDensity: number
    narrativeStructure: number
    marketAppeal: number
    estimatedBudget: 'LOW' | 'MEDIUM' | 'HIGH' | 'BLOCKBUSTER'
    suggestedFormat: 'SHORT' | 'FEATURE' | 'SERIES'
    feedback: string
    adaptationOutline: string
  }
} | null

const FORMAT_LABELS = {
  SHORT: 'Short film',
  FEATURE: 'Feature film',
  SERIES: 'Series',
}

const BUDGET_LABELS = {
  LOW: 'Budget Modeste',
  MEDIUM: 'Budget Moyen',
  HIGH: 'High budget',
  BLOCKBUSTER: 'Blockbuster',
}

const BUDGET_COLORS = {
  LOW: 'text-green-400 bg-green-400/10 border-green-400/20',
  MEDIUM: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  HIGH: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  BLOCKBUSTER: 'text-[#E50914] bg-[#E50914]/10 border-[#E50914]/20',
}

export default function BookAdaptationPage() {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    submitBookForAdaptationAction,
    null
  )
  const [hasDialogue, setHasDialogue] = useState(false)
  const [showOutline, setShowOutline] = useState(false)

  useEffect(() => {
    document.title = 'Adapter un Livre — CINEGENY'
  }, [])

  if (state?.success && state.analysis) {
    const { analysis } = state
    const scoreColor =
      analysis.score >= 75
        ? 'text-green-400'
        : analysis.score >= 55
        ? 'text-amber-400'
        : 'text-red-400'

    return (
      <div className="min-h-screen py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair mb-3">
              Analyse Terminée
            </h1>
            <p className="text-white/50 text-sm sm:text-base">
              Votre livre a été soumis pour adaptation. Voici les résultats de l&apos;analyse IA.
            </p>
          </div>

          {/* Score Card */}
          <div className="relative mb-6">
            <div className="absolute -inset-1 bg-gradient-to-b from-[#E50914]/10 via-transparent to-[#E50914]/5 rounded-3xl blur-xl opacity-60" />
            <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Score Global</p>
                  <p className={`text-5xl font-bold ${scoreColor}`}>{analysis.score}<span className="text-2xl text-white/30">/100</span></p>
                </div>
                <div className={`px-4 py-2 rounded-xl border text-sm font-semibold ${BUDGET_COLORS[analysis.estimatedBudget]}`}>
                  {BUDGET_LABELS[analysis.estimatedBudget]}
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Potentiel Visuel', value: analysis.visualPotential, icon: Film },
                  { label: 'Dialogue density', value: analysis.dialogueDensity, icon: MessageSquare },
                  { label: 'Structure Narrative', value: analysis.narrativeStructure, icon: TrendingUp },
                  { label: 'Market appeal', value: analysis.marketAppeal, icon: Star },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-3">
                      <item.icon className="h-3.5 w-3.5 text-[#E50914]/70" />
                      <span className="text-white/50 text-xs">{item.label}</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-white font-bold text-lg">{item.value}</span>
                      <span className="text-white/30 text-xs mb-0.5">/100</span>
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-white/[0.06]">
                      <div
                        className="h-1 rounded-full bg-[#E50914]"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Format Suggestion */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#E50914]/[0.06] border border-[#E50914]/15 mb-6">
                <Clock className="h-4 w-4 text-[#E50914] shrink-0" />
                <div>
                  <p className="text-white/50 text-xs">Recommended format</p>
                  <p className="text-white font-semibold text-sm">{FORMAT_LABELS[analysis.suggestedFormat]}</p>
                </div>
              </div>

              {/* Feedback */}
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-white/70 text-sm leading-relaxed italic">&quot;{analysis.feedback}&quot;</p>
              </div>
            </div>
          </div>

          {/* Adaptation Outline Toggle */}
          <div className="mb-8">
            <button
              onClick={() => setShowOutline(!showOutline)}
              className="w-full flex items-center justify-between p-5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-[#E50914]/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-[#E50914]" />
                <span className="text-white/80 font-medium text-sm">Voir l&apos;outline d&apos;adaptation</span>
              </div>
              <ChevronRight className={`h-4 w-4 text-white/40 transition-transform duration-300 ${showOutline ? 'rotate-90' : ''}`} />
            </button>
            {showOutline && (
              <div className="mt-3 p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] max-h-[400px] overflow-y-auto">
                <pre className="text-white/60 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                  {analysis.adaptationOutline}
                </pre>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/screenplays"
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#E50914]/20"
            >
              Voir mes scénarios
              <ChevronRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border border-white/[0.08] text-white/70 hover:bg-white/[0.03] font-medium text-sm transition-all duration-300"
            >
              Soumettre un autre livre
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#E50914]/[0.03] blur-[200px]" />
      </div>

      <div className="container mx-auto max-w-2xl relative">
        {/* Back Link */}
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm mb-10 transition-colors duration-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-6">
            <BookOpen className="h-8 w-8 text-[#E50914]" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E50914]/15 bg-[#E50914]/[0.06] text-[#E50914] text-xs font-medium mb-5">
            <Sparkles className="h-3 w-3" />
            Pipeline Book-to-Screen
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-playfair mb-3">
            Adapter un Livre
          </h1>
          <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Soumettez votre livre pour une analyse IA complète de son potentiel d&apos;adaptation cinématographique.
          </p>
        </div>

        {/* Form Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-b from-[#E50914]/10 via-transparent to-[#E50914]/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-8 sm:p-10 shadow-2xl shadow-black/20">
            <form action={action} className="space-y-6">
              {state?.error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  {state.error}
                </div>
              )}

              {/* Book Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-white/70 text-sm font-medium">
                  Titre du livre <span className="text-[#E50914]">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Ex : L'Étranger"
                    required
                    className="w-full pl-11 pr-4 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label htmlFor="author" className="block text-white/70 text-sm font-medium">
                  Auteur <span className="text-[#E50914]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <input
                    id="author"
                    name="author"
                    type="text"
                    placeholder="Ex : Albert Camus"
                    required
                    className="w-full pl-11 pr-4 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              {/* Publisher + ISBN Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="publisher" className="block text-white/70 text-sm font-medium">
                    Éditeur
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                    <input
                      id="publisher"
                      name="publisher"
                      type="text"
                      placeholder="Ex : Gallimard"
                      className="w-full pl-11 pr-4 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all duration-300 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="isbn" className="block text-white/70 text-sm font-medium">
                    ISBN <span className="text-white/30 text-xs font-normal">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                    <input
                      id="isbn"
                      name="isbn"
                      type="text"
                      placeholder="978-2-07-036024-5"
                      className="w-full pl-11 pr-4 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all duration-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <label htmlFor="genre" className="block text-white/70 text-sm font-medium">
                  Genre <span className="text-[#E50914]">*</span>
                </label>
                <div className="relative">
                  <Film className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 pointer-events-none" />
                  <select
                    id="genre"
                    name="genre"
                    required
                    defaultValue=""
                    className="w-full pl-11 pr-4 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all duration-300 text-sm appearance-none"
                  >
                    <option value="" disabled className="bg-[#0A0A0A] text-white/50">Choisir un genre...</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g} className="bg-[#0A0A0A] text-white">{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Synopsis */}
              <div className="space-y-2">
                <label htmlFor="synopsis" className="block text-white/70 text-sm font-medium">
                  Synopsis <span className="text-[#E50914]">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-white/25" />
                  <textarea
                    id="synopsis"
                    name="synopsis"
                    rows={5}
                    required
                    placeholder="Résumez l'histoire en quelques phrases ou paragraphes. Plus le synopsis est détaillé, meilleure sera l'analyse d'adaptation..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all duration-300 text-sm resize-none"
                  />
                </div>
                <p className="text-white/25 text-xs">Un synopsis de 50+ mots améliore la précision de l&apos;analyse.</p>
              </div>

              {/* Why adapted */}
              <div className="space-y-2">
                <label htmlFor="whyAdapt" className="block text-white/70 text-sm font-medium">
                  Pourquoi ce livre devrait être adapté ?
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-white/25" />
                  <textarea
                    id="whyAdapt"
                    name="whyAdapt"
                    rows={3}
                    placeholder="Quels éléments rendent ce livre particulièrement cinématographique ? (personnages forts, univers visuel, thèmes universels...)"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all duration-300 text-sm resize-none"
                  />
                </div>
              </div>

              {/* Page Count + Dialogue Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="pageCount" className="block text-white/70 text-sm font-medium">
                    Nombre de pages
                  </label>
                  <input
                    id="pageCount"
                    name="pageCount"
                    type="number"
                    min="1"
                    max="2000"
                    placeholder="Ex : 320"
                    defaultValue="200"
                    className="w-full px-4 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#E50914]/40 focus:ring-1 focus:ring-[#E50914]/20 transition-all duration-300 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-white/70 text-sm font-medium">
                    Contient des dialogues ?
                  </label>
                  <div className="flex items-center h-12 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hasDialogue"
                        value="true"
                        checked={hasDialogue === true}
                        onChange={() => setHasDialogue(true)}
                        className="accent-[#E50914]"
                      />
                      <span className="text-white/70 text-sm">Oui</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hasDialogue"
                        value="false"
                        checked={hasDialogue === false}
                        onChange={() => setHasDialogue(false)}
                        className="accent-[#E50914]"
                      />
                      <span className="text-white/70 text-sm">Non / Peu</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#E50914]/[0.04] border border-[#E50914]/10">
                <Sparkles className="h-4 w-4 text-[#E50914] shrink-0 mt-0.5" />
                <p className="text-white/50 text-xs leading-relaxed">
                  L&apos;analyse IA évalue le potentiel visuel, la densité dramatique et l&apos;attrait marché pour générer un score d&apos;adaptation et un outline de scénario personnalisé.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-12 rounded-xl bg-[#E50914] hover:bg-[#FF2D2D] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyser le potentiel d&apos;adaptation
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/25 text-xs mt-8 leading-relaxed">
          En soumettant ce livre, vous autorisez CINEGENY à générer un outline d&apos;adaptation à titre d&apos;analyse.
          Les droits d&apos;auteur restent la propriété de leurs détenteurs respectifs.
        </p>
      </div>
    </div>
  )
}
