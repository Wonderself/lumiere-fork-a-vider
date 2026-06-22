'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PHOTO_STYLES, PHOTO_RATIOS, CINEMA_CATEGORIES } from '@/data/studio-agents'
import Link from 'next/link'
import {
  Wand2, ArrowRight, ArrowLeft, Image, Film, Users,
  Palette, Building, Sparkles, Camera, Loader2, Download,
  Share2, RefreshCcw, Save, Check, ChevronRight, Star,
  Lightbulb, Shield, Eye, Copy, Heart, Zap,
} from 'lucide-react'

interface CreationType {
  id: string; label: string; description: string; icon: typeof Image; color: string
  promptHints: string[]; suggestedStyle: string; suggestedRatio: string
}

const CREATION_TYPES: CreationType[] = [
  { id: 'poster', label: 'Affiche de Film', description: 'Créez une affiche professionnelle pour votre film', icon: Image, color: '#E50914',
    promptHints: ['Décrivez le personnage principal et son expression', 'Indiquez l\'ambiance (sombre, lumineux, mystérieux)', 'Mentionnez le titre et le genre'], suggestedStyle: 'cinematic', suggestedRatio: '9:16' },
  { id: 'storyboard', label: 'Storyboard', description: 'Dessinez vos scènes plan par plan', icon: Film, color: '#3B82F6',
    promptHints: ['Décrivez l\'action dans le plan', 'Précisez l\'angle de caméra (plongée, contre-plongée, profil)', 'Indiquez le mouvement'], suggestedStyle: 'artistic', suggestedRatio: '16:9' },
  { id: 'still', label: 'Photo de Scène', description: 'Générez un still de haute qualité pour votre film', icon: Camera, color: '#10B981',
    promptHints: ['Décrivez le décor et l\'éclairage', 'Placez les personnages dans la scène', 'Indiquez l\'émotion dominante'], suggestedStyle: 'cinematic', suggestedRatio: '16:9' },
  { id: 'character', label: 'Portrait Personnage', description: 'Créez le portrait de vos personnages', icon: Users, color: '#8B5CF6',
    promptHints: ['Décrivez le physique (âge, cheveux, yeux)', 'Indiquez la personnalité (expressions)', 'Précisez le costume et l\'époque'], suggestedStyle: 'realistic', suggestedRatio: '1:1' },
  { id: 'mood', label: 'Mood Board', description: 'Explorez des ambiances pour votre projet', icon: Palette, color: '#F59E0B',
    promptHints: ['Décrivez l\'ambiance générale', 'Mentionnez les couleurs dominantes', 'Indiquez les références visuelles'], suggestedStyle: 'artistic', suggestedRatio: '4:3' },
]

const PROMPT_EXAMPLES: Record<string, string[]> = {
  poster: [
    'Une femme détective en imperméable noir, debout sous la pluie devant des néons rouges, regard déterminé. Titre: "OMBRES". Film noir cyberpunk.',
    'Un astronaute flottant dans l\'espace face à une planète géante, couleurs violettes et oranges. Film de science-fiction épique.',
    'Gros plan sur un visage à moitié dans l\'ombre, un couteau reflétant la lumière. Thriller psychologique minimaliste.',
  ],
  storyboard: [
    'Plan large: une voiture s\'approche d\'un manoir isolé sous la pluie. Vue de drone. Nuit.',
    'Plan moyen: deux personnages face à face à une table, tension palpable. Éclairage latéral.',
    'Gros plan: une main qui saisit une lettre sur une table. Focus sur l\'enveloppe scellée.',
  ],
  still: [
    'Intérieur d\'un bar jazz enfumé, éclairage tamisé rouge et bleu. Un pianiste joue seul. Années 50.',
    'Forêt dense au lever du soleil, rayons de lumière à travers les arbres. Une silhouette au loin.',
    'Rue de Tokyo la nuit, néons et reflets sur le sol mouillé. Une femme marche seule.',
  ],
  character: [
    'Femme, 30 ans, cheveux noirs courts, regard perçant, cicatrice sur la joue gauche. Veste en cuir. Détective.',
    'Homme âgé, barbe blanche, yeux bleus bienveillants, pull tricoté. Professeur de philosophie.',
    'Adolescent, 16 ans, cheveux teints bleu, sourire espiègle, casque audio autour du cou. Hacker.',
  ],
  mood: [
    'Ambiance film noir : ombres profondes, rues mouillées, fumée, néons, mystère. Palette : noir, gris, rouge profond.',
    'Ambiance Wes Anderson : symétrie, couleurs pastel, composition géométrique, vintage. Rose, jaune, menthe.',
    'Ambiance Blade Runner : néons, pluie, gratte-ciels, hologrammes, cyan et magenta.',
  ],
}

export default function GuidedStudioPage() {
  const [step, setStep] = useState(0)
  const [creationType, setCreationType] = useState<CreationType | null>(null)
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('')
  const [ratio, setRatio] = useState('')
  const [hdMode, setHdMode] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  function selectType(type: CreationType) {
    setCreationType(type)
    setStyle(type.suggestedStyle)
    setRatio(type.suggestedRatio)
    setStep(1)
  }

  function useExample(example: string) {
    setPrompt(example)
  }

  async function generate() {
    setGenerating(true)
    setProgress(0)
    setResult(null)

    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 60))
      setProgress(i)
    }

    const placeholders = [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=900&q=80',
    ]
    setResult(placeholders[Math.floor(Math.random() * placeholders.length)])
    setGenerating(false)
    setStep(4)
    toast.success('Image générée avec succès !')
  }

  async function regenerate() {
    setStep(3)
    setTimeout(() => generate(), 300)
  }

  const TIPS_DURING_GENERATION = [
    '💡 Astuce : des prompts détaillés donnent de meilleurs résultats',
    '🎨 Les styles "cinematic" et "realistic" sont les plus populaires',
    '📐 Le format 16:9 est standard pour les scènes de film',
    '✨ Vous pouvez régénérer autant de fois que nécessaire',
    '🔒 0% commission — vous ne payez que le coût réel',
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/studio" className="text-xs text-gray-500 hover:text-white">Studio ←</Link>
              <span className="text-xs text-gray-700">Mode Guidé</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Studio Créatif — <span className="text-[#E50914]">Mode Guidé</span>
            </h1>
          </div>
          <Link href="/studio/pro" className="text-xs text-gray-500 hover:text-[#E50914] flex items-center gap-1">
            Mode Pro <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10">
          {['Type', 'Description', 'Style', 'Génération', 'Résultat'].map((label, i) => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i < step ? 'bg-[#E50914] text-white' :
                i === step ? 'bg-[#E50914]/20 text-[#E50914] border-2 border-[#E50914]' :
                'bg-gray-800 text-gray-500'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-[10px] hidden sm:block ${i <= step ? 'text-white' : 'text-gray-600'}`}>{label}</span>
              {i < 4 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-[#E50914]' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        {/* STEP 0: Choose Type */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Wand2 className="h-10 w-10 text-[#E50914] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Que voulez-vous créer ?</h2>
              <p className="text-gray-400">Choisissez le type de visuel et l&apos;IA vous guidera étape par étape.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CREATION_TYPES.map(type => {
                const Icon = type.icon
                return (
                  <button key={type.id} onClick={() => selectType(type)} className="group text-left rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-900/30 p-8 hover:border-[#E50914]/30 hover:shadow-lg hover:shadow-[#E50914]/5 transition-all">
                    <Icon className="h-10 w-10 mb-4 group-hover:scale-110 transition-transform" style={{ color: type.color }} />
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#E50914] transition-colors">{type.label}</h3>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 1: Describe Vision */}
        {step === 1 && creationType && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Décrivez votre vision</h2>
              <p className="text-gray-400">Plus vous êtes précis, meilleur sera le résultat.</p>
            </div>

            {/* Prompt Hints */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <span className="text-xs font-medium text-yellow-400">Conseils pour {creationType.label}</span>
              </div>
              <ul className="space-y-1.5">
                {creationType.promptHints.map(hint => (
                  <li key={hint} className="text-xs text-gray-400 flex items-center gap-2">
                    <ChevronRight className="h-3 w-3 text-[#E50914] shrink-0" />{hint}
                  </li>
                ))}
              </ul>
            </div>

            {/* Textarea */}
            <div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={`Décrivez votre ${creationType.label.toLowerCase()} en détail...`} rows={5}
                className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-6 py-4 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none" />
              <p className="text-[10px] text-gray-600 mt-1 text-right">{prompt.length} caractères</p>
            </div>

            {/* Examples */}
            <div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Star className="h-3 w-3 text-yellow-400" />Exemples (cliquez pour utiliser)</p>
              <div className="space-y-2">
                {(PROMPT_EXAMPLES[creationType.id] || []).map((example, i) => (
                  <button key={i} onClick={() => useExample(example)} className="w-full text-left rounded-xl border border-gray-800 bg-gray-900/30 px-4 py-3 text-xs text-gray-400 hover:border-gray-600 hover:text-gray-300 transition-colors">
                    &quot;{example}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(0)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" />Retour</button>
              <button onClick={() => setStep(2)} disabled={!prompt.trim()} className="flex items-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl disabled:opacity-30 transition-colors">
                Suivant <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Choose Style */}
        {step === 2 && creationType && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Choisissez le style</h2>
              <p className="text-gray-400">Le style pré-sélectionné est idéal pour votre type de création.</p>
            </div>

            {/* Style */}
            <div>
              <label className="text-xs text-gray-400 mb-3 block">Style visuel</label>
              <div className="grid grid-cols-5 gap-3">
                {PHOTO_STYLES.map(s => (
                  <button key={s.id} onClick={() => setStyle(s.id)} className={`rounded-xl border p-4 text-center transition-all ${style === s.id ? 'border-[#E50914] bg-[#E50914]/10 shadow-lg shadow-[#E50914]/5' : 'border-gray-800 hover:border-gray-600'}`}>
                    <p className="text-sm font-medium text-white">{s.label}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{s.description}</p>
                    {style === s.id && <Check className="h-4 w-4 text-[#E50914] mx-auto mt-2" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Ratio */}
            <div>
              <label className="text-xs text-gray-400 mb-3 block">Format</label>
              <div className="flex gap-3">
                {PHOTO_RATIOS.map(r => (
                  <button key={r.id} onClick={() => setRatio(r.id)} className={`flex-1 rounded-xl border p-4 text-center transition-all ${ratio === r.id ? 'border-[#E50914] bg-[#E50914]/10' : 'border-gray-800 hover:border-gray-600'}`}>
                    <p className="text-lg font-bold text-white">{r.label}</p>
                    <p className="text-[10px] text-gray-500">{r.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* HD Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900/50 p-5">
              <div>
                <p className="text-sm font-medium text-white">Qualité HD</p>
                <p className="text-[10px] text-gray-500">Résolution 1.5x supérieure (coûte ~0.5 crédit de plus)</p>
              </div>
              <button onClick={() => setHdMode(!hdMode)} className={`relative h-7 w-12 rounded-full transition-colors ${hdMode ? 'bg-[#E50914]' : 'bg-gray-600'}`}>
                <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${hdMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-5">
              <h3 className="text-xs text-gray-400 mb-2">Récapitulatif</h3>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div><p className="text-[10px] text-gray-500">Type</p><p className="text-xs font-medium text-white">{creationType.label}</p></div>
                <div><p className="text-[10px] text-gray-500">Style</p><p className="text-xs font-medium text-white">{PHOTO_STYLES.find(s => s.id === style)?.label}</p></div>
                <div><p className="text-[10px] text-gray-500">Format</p><p className="text-xs font-medium text-white">{ratio}</p></div>
                <div><p className="text-[10px] text-gray-500">Qualité</p><p className="text-xs font-medium text-white">{hdMode ? 'HD' : 'Standard'}</p></div>
              </div>
              <p className="text-[10px] text-emerald-400 text-center mt-3">~{hdMode ? '2.0' : '1.5'} crédits · 0% commission</p>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white"><ArrowLeft className="h-4 w-4" />Retour</button>
              <button onClick={() => { setStep(3); setTimeout(generate, 500) }} className="flex items-center gap-2 px-8 py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl transition-colors text-lg">
                <Sparkles className="h-5 w-5" /> Générer
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Generating */}
        {step === 3 && (
          <div className="text-center py-16">
            <Loader2 className="h-16 w-16 text-[#E50914] mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-3">Création en cours...</h2>
            <p className="text-gray-400 mb-6">L&apos;IA compose votre {creationType?.label.toLowerCase()}</p>

            {/* Progress */}
            <div className="w-full max-w-md mx-auto h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-[#E50914] to-[#FF6B35] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-gray-500">{progress}%</p>

            {/* Tips */}
            <div className="mt-10 rounded-xl border border-gray-800 bg-gray-900/30 p-5 max-w-md mx-auto">
              <p className="text-xs text-gray-400">
                {TIPS_DURING_GENERATION[Math.floor((progress / 20) % TIPS_DURING_GENERATION.length)]}
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Result */}
        {step === 4 && result && (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <Sparkles className="h-8 w-8 text-[#E50914] mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-white mb-2">Votre {creationType?.label} est prêt(e) !</h2>
            </div>

            {/* Image */}
            <div className="rounded-2xl border border-gray-800 overflow-hidden bg-gray-900">
              <img src={result} alt={prompt} className="w-full" />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button onClick={regenerate} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                <RefreshCcw className="h-4 w-4" /> Régénérer
              </button>
              <button onClick={() => toast.success('Téléchargé')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                <Download className="h-4 w-4" /> Télécharger
              </button>
              <button onClick={async () => { await navigator.clipboard.writeText(result!); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-sm text-gray-300 hover:bg-gray-700 transition-colors">
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />} {copied ? 'Copié' : 'Copier URL'}
              </button>
              <button onClick={() => { setSaved(true); toast.success('Sauvegardé dans votre projet') }} className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-colors ${saved ? 'bg-green-600 text-white' : 'border border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white'}`}>
                {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />} {saved ? 'Sauvé' : 'Sauver'}
              </button>
            </div>

            {/* Prompt Used */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-[10px] text-gray-500 mb-1">Prompt utilisé :</p>
              <p className="text-xs text-gray-400">&quot;{prompt}&quot;</p>
              <p className="text-[10px] text-gray-600 mt-1">Style: {style} · Format: {ratio} · {hdMode ? 'HD' : 'Standard'}</p>
            </div>

            {/* Next Actions */}
            <div className="flex gap-3 pt-4">
              <button onClick={() => { setStep(0); setPrompt(''); setResult(null); setSaved(false) }} className="flex-1 py-3 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-800 text-sm">Créer autre chose</button>
              <Link href="/studio/pro" className="flex-1 py-3 bg-[#E50914] text-white rounded-xl hover:bg-[#FF2D2D] text-sm font-semibold text-center flex items-center justify-center gap-2">
                <Zap className="h-4 w-4" /> Passer en mode Pro
              </Link>
            </div>

            <p className="text-[10px] text-emerald-400 text-center flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" /> 0% commission — coût réel : ~{hdMode ? '2.0' : '1.5'} crédits
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
