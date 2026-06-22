'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import { submitScenarioAction } from '@/app/actions/community'
import { generateSynopsisAction } from '@/app/actions/ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PenTool, ChevronDown, ChevronUp, CheckCircle, Sparkles, Wand2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const GENRES = [
  'Science-Fiction',
  'Drame',
  'Thriller',
  'Comedie',
  'Horreur',
  'Action',
  'Romance',
  'Fantastique',
  'Animation',
  'Documentaire',
  'Experimental',
]

export function SubmitScenarioForm() {
  const [state, formAction, isPending] = useActionState(submitScenarioAction, null)
  const [isOpen, setIsOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // AI Synopsis Generator state
  const [aiTitle, setAiTitle] = useState('')
  const [aiGenre, setAiGenre] = useState('')
  const [logline, setLogline] = useState('')
  const [synopsis, setSynopsis] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
      setLogline('')
      setSynopsis('')
      setAiTitle('')
      setAiGenre('')
      setTimeout(() => setIsOpen(false), 2500)
    }
  }, [state?.success])

  const handleGenerate = async () => {
    if (!aiTitle || aiTitle.length < 2) {
      setAiError('Entrez un titre (minimum 2 caracteres) avant de generer.')
      return
    }
    if (!aiGenre) {
      setAiError('Choisissez un genre avant de generer.')
      return
    }

    setAiError('')
    setIsGenerating(true)

    try {
      const fd = new FormData()
      fd.set('title', aiTitle)
      fd.set('genre', aiGenre)
      const result = await generateSynopsisAction(null, fd)

      if (result?.error) {
        setAiError(result.error)
      } else if (result?.logline && result?.synopsis) {
        setLogline(result.logline)
        setSynopsis(result.synopsis)
      }
    } catch {
      setAiError('Erreur lors de la generation. Reessayez.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <PenTool className="h-5 w-5 text-[#E50914]" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Proposer un scenario</h3>
            <p className="text-sm text-gray-500">Soumettez votre idee de film a la communaute</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {/* Form */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-gray-200 pt-5">
            {/* Success message */}
            {state?.success && (
              <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-600">Proposition soumise avec succes !</p>
                  <p className="text-xs text-green-500 mt-0.5">Elle sera examinee par notre equipe et analysee par l&apos;IA.</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {state?.error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {state.error}
              </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Titre du scenario *
                </label>
                <Input
                  name="title"
                  required
                  minLength={5}
                  maxLength={200}
                  placeholder="Ex: Les Echos du Silence"
                  className="bg-white border-gray-200 focus:border-[#E50914]/40"
                  value={aiTitle}
                  onChange={(e) => setAiTitle(e.target.value)}
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Genre
                </label>
                <select
                  name="genre"
                  value={aiGenre}
                  onChange={(e) => setAiGenre(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-200"
                >
                  <option value="">Choisir un genre...</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* AI Synopsis Generator */}
              <div className="p-4 rounded-xl border border-dashed border-[#E50914]/30 bg-[#E50914]/[0.03]">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-[#E50914]" />
                    <span className="text-xs font-semibold text-[#E50914]">Assistant IA</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                      isGenerating
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#E50914] text-white hover:bg-[#FF2D2D] hover:shadow-sm'
                    )}
                  >
                    {isGenerating ? (
                      <><Loader2 className="h-3 w-3 animate-spin" /> Generation...</>
                    ) : (
                      <><Sparkles className="h-3 w-3" /> Generer avec l&apos;IA</>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400">
                  Remplissez le titre et le genre, puis laissez l&apos;IA generer une logline et un synopsis pour vous.
                </p>
                {aiError && (
                  <p className="mt-2 text-xs text-red-500">{aiError}</p>
                )}
              </div>

              {/* Logline */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Logline * <span className="text-gray-400">(10-500 caracteres)</span>
                </label>
                <Textarea
                  name="logline"
                  required
                  minLength={10}
                  maxLength={500}
                  rows={2}
                  placeholder="Un resume accrocheur de votre histoire en une ou deux phrases..."
                  className="bg-white border-gray-200 focus:border-[#E50914]/40"
                  value={logline}
                  onChange={(e) => setLogline(e.target.value)}
                />
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Synopsis <span className="text-gray-400">(optionnel)</span>
                </label>
                <Textarea
                  name="synopsis"
                  rows={5}
                  placeholder="Developpez votre histoire plus en detail..."
                  className="bg-white border-gray-200 focus:border-[#E50914]/40"
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  loading={isPending}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {isPending ? 'Envoi en cours...' : 'Soumettre la proposition'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
