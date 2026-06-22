'use client'

import { useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FileText,
  PenTool,
  Wand2,
  DollarSign,
  Send,
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
} from 'lucide-react'
import { submitScreenplayAction } from '@/app/actions/screenplays'

const STEPS = [
  { id: 'infos', label: 'Infos', icon: FileText },
  { id: 'contenu', label: 'Contenu', icon: PenTool },
  { id: 'tolerance', label: 'Tolerance IA', icon: Wand2 },
  { id: 'revenue', label: 'Revenue Share', icon: DollarSign },
  { id: 'review', label: 'Soumettre', icon: Send },
]

const GENRES = [
  'Drame',
  'Comedie',
  'Thriller',
  'Sci-Fi',
  'Horreur',
  'Animation',
  'Documentaire',
  'Action',
  'Romance',
  'Fantastique',
]

export default function ScreenplayNewPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  // Form data
  const [title, setTitle] = useState('')
  const [logline, setLogline] = useState('')
  const [genre, setGenre] = useState('')
  const [content, setContent] = useState('')
  const [contentUrl, setContentUrl] = useState('')
  const [modificationTolerance, setModificationTolerance] = useState([20])
  const [revenueSharePct, setRevenueSharePct] = useState([0])
  const [legalAck, setLegalAck] = useState(false)

  const [state, formAction, isPending] = useActionState(submitScreenplayAction, null)

  // If success, redirect
  if (state?.success) {
    router.push('/screenplays')
  }

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return title.trim().length >= 2
      case 1:
        return content.trim().length >= 100 || contentUrl.trim().length > 0
      case 2:
        return true
      case 3:
        return legalAck
      case 4:
        return true
      default:
        return false
    }
  }

  const next = () => {
    if (currentStep < STEPS.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl sm:text-4xl font-bold"
        >
          Soumettre un Scenario
        </h1>
        <p className="text-sm text-white/40 mt-1">
          Soumettez votre scenario pour evaluation par notre IA
        </p>
      </div>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Step Indicator */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => index <= currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-500 w-full ${
                  isActive
                    ? 'bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/20'
                    : isCompleted
                    ? 'bg-green-500/10 text-green-600 border border-green-500/20 cursor-pointer'
                    : 'bg-white/[0.03] text-white/30 border border-white/5'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <StepIcon className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="hidden sm:inline truncate">{step.label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-px w-2 mx-1 shrink-0 ${
                    isCompleted ? 'bg-green-500/40' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <Card variant="glass">
        <CardContent className="p-8">
          {/* Step 1: Infos */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du scenario *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Les Dernieres Lumieres"
                  className="bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logline">Logline</Label>
                <Textarea
                  id="logline"
                  value={logline}
                  onChange={(e) => setLogline(e.target.value)}
                  placeholder="Resumez votre scenario en une ou deux phrases..."
                  rows={3}
                  className="bg-white/[0.03]"
                />
                <p className="text-xs text-white/25">{logline.length}/500 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label>Genre</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="bg-white/[0.03]">
                    <SelectValue placeholder="Selectionnez un genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Contenu */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content">Contenu du scenario *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Collez ou ecrivez votre scenario ici (minimum 100 caracteres)..."
                  rows={16}
                  className="bg-white/[0.03] font-mono text-sm"
                />
                <div className="flex items-center justify-between text-xs text-white/25">
                  <span>{content.length} caracteres</span>
                  <span className={content.length >= 100 ? 'text-green-600' : 'text-orange-600'}>
                    {content.length >= 100 ? 'Minimum atteint' : `${100 - content.length} restants`}
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0A0A0A] px-3 text-white/30">ou</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentUrl">Lien vers un document externe</Label>
                <Input
                  id="contentUrl"
                  type="url"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  placeholder="https://docs.google.com/..."
                  className="bg-white/[0.03]"
                />
                <p className="text-xs text-white/25">
                  Google Docs, Notion, Dropbox, etc.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Tolerance IA */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Tolerance de modification IA</h3>
                <p className="text-sm text-white/40">
                  Definissez le pourcentage de modifications que l&#39;IA peut apporter a votre scenario
                  lors de la production.
                </p>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-[#E50914]">
                    {modificationTolerance[0]}%
                  </span>
                </div>

                <Slider
                  value={modificationTolerance}
                  onValueChange={setModificationTolerance}
                  max={50}
                  min={0}
                  step={5}
                />

                <div className="flex justify-between text-xs text-white/30">
                  <span>0% - Aucune modification</span>
                  <span>50% - Modifications importantes</span>
                </div>
              </div>

              <div className="rounded-xl bg-[#E50914]/5 border border-[#E50914]/15 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-4 w-4 text-[#E50914] mt-0.5 shrink-0" />
                  <div className="text-sm text-white/50">
                    <p className="mb-1">
                      <strong className="text-white/70">0%</strong> : Votre scenario sera utilise tel quel.
                    </p>
                    <p className="mb-1">
                      <strong className="text-white/70">10-20%</strong> : Ajustements mineurs (dialogues, rythme).
                    </p>
                    <p>
                      <strong className="text-white/70">30-50%</strong> : L&#39;IA peut restructurer des scenes entieres.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Revenue Share */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Partage des revenus</h3>
                <p className="text-sm text-white/40">
                  Definissez le pourcentage des revenus du film que vous souhaitez recevoir en tant
                  qu&#39;auteur du scenario.
                </p>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-5xl font-bold text-[#E50914]">
                    {revenueSharePct[0]}%
                  </span>
                </div>

                <Slider
                  value={revenueSharePct}
                  onValueChange={setRevenueSharePct}
                  max={30}
                  min={0}
                  step={1}
                />

                <div className="flex justify-between text-xs text-white/30">
                  <span>0% - Pas de partage</span>
                  <span>30% - Maximum</span>
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-4 w-4 text-white/40 mt-0.5 shrink-0" />
                  <p className="text-sm text-white/40">
                    Un pourcentage plus eleve peut reduire les chances d&#39;acceptation de votre scenario.
                    Les scenarios a 0% sont prioritaires dans la file d&#39;attente.
                  </p>
                </div>
              </div>

              {/* Legal acknowledgment */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={legalAck}
                  onChange={(e) => setLegalAck(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-[#E50914] focus:ring-[#E50914]/50 accent-[#E50914]"
                />
                <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                  Je certifie etre l&#39;auteur original de ce scenario et j&#39;accepte les conditions
                  de soumission de CINEGENY, incluant l&#39;evaluation automatique par IA et le partage
                  des revenus tel que defini ci-dessus.
                </span>
              </label>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Recapitulatif</h3>
                <p className="text-sm text-white/40">
                  Verifiez les informations avant de soumettre votre scenario.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-white/40">Titre</span>
                    <span className="text-sm font-medium">{title}</span>
                  </div>
                  {genre && (
                    <div className="flex justify-between">
                      <span className="text-sm text-white/40">Genre</span>
                      <span className="text-sm">{genre}</span>
                    </div>
                  )}
                  {logline && (
                    <div>
                      <span className="text-sm text-white/40">Logline</span>
                      <p className="text-sm text-white/60 mt-1">{logline}</p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-white/40">Contenu</span>
                    <span className="text-sm text-white/60">
                      {content.length > 0
                        ? `${content.length} caracteres`
                        : contentUrl
                        ? 'Lien externe'
                        : 'Non renseigne'}
                    </span>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex justify-between">
                    <span className="text-sm text-white/40">Tolerance IA</span>
                    <span className="text-sm font-medium text-[#E50914]">
                      {modificationTolerance[0]}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/40">Revenue share</span>
                    <span className="text-sm font-medium text-[#E50914]">
                      {revenueSharePct[0]}%
                    </span>
                  </div>
                </div>

                {state?.error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-sm text-red-400">{state.error}</p>
                  </div>
                )}

                <form action={formAction}>
                  <input type="hidden" name="title" value={title} />
                  <input type="hidden" name="logline" value={logline} />
                  <input type="hidden" name="genre" value={genre} />
                  <input type="hidden" name="content" value={content || contentUrl || ''} />
                  <input type="hidden" name="modificationTolerance" value={modificationTolerance[0]} />
                  <input type="hidden" name="revenueShareBps" value={revenueSharePct[0] * 100} />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isPending}
                    loading={isPending}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isPending ? 'Soumission en cours...' : 'Soumettre le scenario'}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={currentStep === 0}
          className={currentStep === 0 ? 'invisible' : ''}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Precedent
        </Button>

        {currentStep < STEPS.length - 1 && (
          <Button
            variant="outline"
            onClick={next}
            disabled={!canProceed()}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}
