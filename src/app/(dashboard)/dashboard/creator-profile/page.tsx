'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { toast } from 'sonner'
import {
  User, Camera, Film, Music, Palette, PenTool, Scissors,
  Save, CheckCircle2, Circle, ArrowRight, Plus, X,
  Globe, Briefcase, Award, Star, Loader2,
} from 'lucide-react'
import { saveCreatorProfileAction } from '@/app/actions/creator'

const SPECIALTIES = [
  { id: 'screenwriting', label: 'Scénariste', icon: PenTool },
  { id: 'directing', label: 'Réalisateur', icon: Film },
  { id: 'cinematography', label: 'Dir Photo', icon: Camera },
  { id: 'editing', label: 'Monteur', icon: Scissors },
  { id: 'music', label: 'Compositeur', icon: Music },
  { id: 'vfx', label: 'VFX Artist', icon: Palette },
  { id: 'acting', label: 'Acteur', icon: Star },
  { id: 'producing', label: 'Producteur', icon: Briefcase },
]

const ONBOARDING_STEPS = [
  { id: 'profile', label: 'Informations de base' },
  { id: 'specialties', label: 'Spécialités' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'bio', label: 'Bio & Présentation' },
]

export default function CreatorProfilePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [actionState, formAction, isPending] = useActionState(saveCreatorProfileAction, null)

  // Form state
  const [displayName, setDisplayName] = useState('')
  const [email] = useState('user@example.com')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([''])
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  const [experience, setExperience] = useState('beginner')
  // Creator profile-specific fields
  const [niche, setNiche] = useState('')
  const [style, setStyle] = useState('NOFACE')
  const [toneOfVoice, setToneOfVoice] = useState('')
  const [automationLevel, setAutomationLevel] = useState('ASSISTED')

  // Show toast on action result
  useEffect(() => {
    if (actionState?.success) toast.success('Profil sauvegardé')
    if (actionState?.error) toast.error(actionState.error)
  }, [actionState])

  function toggleSpecialty(id: string) {
    setSelectedSpecialties(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  function addPortfolioLink() {
    setPortfolioLinks(prev => [...prev, ''])
  }

  function updatePortfolioLink(index: number, value: string) {
    setPortfolioLinks(prev => prev.map((l, i) => i === index ? value : l))
  }

  function removePortfolioLink(index: number) {
    setPortfolioLinks(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Profil Créateur</h1>
        <p className="text-sm text-white/50 mt-1">Complétez votre profil pour maximiser votre visibilité</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {ONBOARDING_STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setCurrentStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full ${
                i === currentStep ? 'bg-[#E50914] text-white' :
                i < currentStep ? 'bg-green-500/10 text-green-400' :
                'bg-white/[0.05] text-white/50'
              }`}
            >
              {i < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
              {step.label}
            </button>
            {i < ONBOARDING_STEPS.length - 1 && <ArrowRight className="h-4 w-4 text-white/50 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <form action={formAction}>
        {/* Hidden fields always submitted so the action has full context */}
        <input type="hidden" name="stageName" value={displayName} />
        <input type="hidden" name="niche" value={niche} />
        <input type="hidden" name="style" value={style} />
        <input type="hidden" name="bio" value={bio} />
        <input type="hidden" name="toneOfVoice" value={toneOfVoice} />
        <input type="hidden" name="automationLevel" value={automationLevel} />
        <input type="hidden" name="step" value={String(currentStep)} />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          {currentStep === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Informations de base</h2>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Nom de scène / Pseudo créateur</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Votre nom de créateur" className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Niche / Thématique</label>
                <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Ex: Cinéma IA, Horreur, Comédie..." className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Localisation</label>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Paris, France" className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Style de présentation</label>
                <select value={style} onChange={e => setStyle(e.target.value)} className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm bg-transparent text-white">
                  <option value="NOFACE">Sans visage (NOFACE)</option>
                  <option value="FACE">Avec visage (FACE)</option>
                  <option value="HYBRID">Hybride</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Niveau d&apos;automatisation</label>
                <select value={automationLevel} onChange={e => setAutomationLevel(e.target.value)} className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm bg-transparent text-white">
                  <option value="ASSISTED">Assisté (recommandé)</option>
                  <option value="AUTO">Automatique</option>
                  <option value="EXPERT">Expert (contrôle total)</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Spécialités</h2>
              <p className="text-xs text-white/50">Sélectionnez vos domaines d&apos;expertise (plusieurs possibles)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SPECIALTIES.map(s => {
                  const SIcon = s.icon
                  const selected = selectedSpecialties.includes(s.id)
                  return (
                    <button type="button" key={s.id} onClick={() => toggleSpecialty(s.id)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${selected ? 'border-[#E50914] bg-red-500/10' : 'border-white/10 hover:border-white/15'}`}>
                      <SIcon className={`h-6 w-6 ${selected ? 'text-[#E50914]' : 'text-white/50'}`} />
                      <span className={`text-xs font-medium ${selected ? 'text-[#E50914]' : 'text-white/60'}`}>{s.label}</span>
                      {selected && <CheckCircle2 className="h-3.5 w-3.5 text-[#E50914]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Portfolio</h2>
              <p className="text-xs text-white/50">Ajoutez des liens vers vos travaux (Vimeo, YouTube, Behance, etc.)</p>
              {portfolioLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input value={link} onChange={e => updatePortfolioLink(i, e.target.value)} placeholder="https://..." className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
                  {portfolioLinks.length > 1 && (
                    <button type="button" onClick={() => removePortfolioLink(i)} className="text-white/50 hover:text-red-400"><X className="h-5 w-5" /></button>
                  )}
                </div>
              ))}
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Ton de voix</label>
                <input value={toneOfVoice} onChange={e => setToneOfVoice(e.target.value)} placeholder="Ex: Inspirant, Humoristique, Sérieux..." className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
              </div>
              <button type="button" onClick={addPortfolioLink} className="flex items-center gap-1.5 text-sm text-[#E50914] hover:underline"><Plus className="h-4 w-4" /> Ajouter un lien</button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Bio & Présentation</h2>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Parlez de vous, de vos projets, de votre vision du cinéma..." rows={8} className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm focus:border-[#E50914] focus:outline-none resize-none" />
              <p className="text-[10px] text-white/50">{bio.length}/1000 caractères</p>
              {actionState?.error && (
                <p className="text-xs text-red-400 flex items-center gap-1.5">
                  <span>⚠</span> {actionState.error}
                </p>
              )}
              {actionState?.success && (
                <p className="text-xs text-green-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Profil sauvegardé avec succès
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button type="button" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="px-4 py-2 text-sm text-white/50 hover:text-white disabled:opacity-30">Précédent</button>
            <div className="flex gap-2">
              {currentStep < ONBOARDING_STEPS.length - 1 ? (
                <button type="button" onClick={() => setCurrentStep(currentStep + 1)} className="px-6 py-2 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-medium rounded-lg transition-colors">Suivant</button>
              ) : (
                <button type="submit" disabled={isPending} className="flex items-center gap-2 px-6 py-2 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
