'use client'

import { useState, useEffect, useTransition } from 'react'
import { Subtitles, Film, Upload, Sparkles, Check, X, Globe, Languages, Plus, Trash2, AlertCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { addSubtitleAction } from '@/app/actions/subtitles'
import { cn } from '@/lib/utils'

const SUPPORTED_LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
]

type Film = {
  id: string
  title: string
  slug: string
  thumbnailUrl?: string | null
  status: string
  subtitles: { lang: string; label: string }[]
}

type AddMode = 'upload' | 'auto'

/* ── Subtitle track badge ── */
function SubtitleBadge({ lang, label, onRemove }: { lang: string; label: string; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914]">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-white transition-colors ml-0.5">
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  )
}

/* ── Add Subtitle Panel ── */
function AddSubtitlePanel({ film, onClose, onSuccess }: { film: Film; onClose: () => void; onSuccess: () => void }) {
  const [mode, setMode] = useState<AddMode>('upload')
  const [selectedLang, setSelectedLang] = useState<string>('fr')
  const [fileContent, setFileContent] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [autoLangs, setAutoLangs] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPending, startTransition] = useTransition()

  const selectedLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.vtt') && !file.name.endsWith('.srt')) {
      toast.error('Seuls les fichiers .vtt et .srt sont acceptés')
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (evt) => setFileContent(evt.target?.result as string || '')
    reader.readAsText(file, 'utf-8')
  }

  function toggleAutoLang(code: string) {
    setAutoLangs(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    )
  }

  async function handleUploadSubmit() {
    if (!fileContent) { toast.error('Veuillez sélectionner un fichier de sous-titres'); return }

    const fd = new FormData()
    fd.set('filmId', film.id)
    fd.set('language', selectedLang)
    fd.set('content', fileContent)

    startTransition(async () => {
      const result = await addSubtitleAction(null, fd)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(`Sous-titres ${selectedLangInfo?.label} ajoutés à "${film.title}"`)
        onSuccess()
      }
    })
  }

  async function handleAutoGenerate() {
    if (autoLangs.length === 0) { toast.error('Sélectionnez au moins une langue cible'); return }

    setIsGenerating(true)
    // Simulated auto-generation — in production this calls a transcription/translation API
    toast.promise(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, 2500 + autoLangs.length * 600)
      }),
      {
        loading: `Génération des sous-titres pour ${autoLangs.length} langue(s)...`,
        success: () => {
          setIsGenerating(false)
          onSuccess()
          return `Sous-titres générés pour ${autoLangs.map(l => SUPPORTED_LANGUAGES.find(x => x.code === l)?.label).join(', ')} !`
        },
        error: 'Erreur lors de la génération',
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-bold text-white">Ajouter des sous-titres</h2>
            <p className="text-xs text-white/40 mt-0.5 truncate max-w-[320px]">{film.title}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode selector */}
        <div className="px-6 pt-5">
          <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.02] p-1 gap-1 mb-5">
            {([
              { id: 'upload' as const, label: 'Importer un fichier', icon: Upload },
              { id: 'auto' as const, label: 'Génération auto', icon: Sparkles },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                  mode === id
                    ? 'bg-[#E50914] text-white shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Upload mode */}
          {mode === 'upload' && (
            <div className="space-y-4">
              {/* Language selector */}
              <div>
                <label className="text-xs font-medium text-white/60 mb-2 block">Langue des sous-titres</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLang(lang.code)}
                      className={cn(
                        'flex flex-col items-center gap-0.5 p-2 rounded-lg text-[10px] font-medium border transition-all duration-200',
                        selectedLang === lang.code
                          ? 'bg-[#E50914]/10 border-[#E50914]/40 text-[#E50914]'
                          : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]'
                      )}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="truncate w-full text-center">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-white/30 mt-1.5">Sélectionné : {selectedLangInfo?.label}</p>
              </div>

              {/* File upload */}
              <div>
                <label className="text-xs font-medium text-white/60 mb-2 block">Fichier de sous-titres (.srt ou .vtt)</label>
                <label className="relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/10 bg-white/[0.01] hover:border-[#E50914]/30 hover:bg-[#E50914]/[0.02] transition-all cursor-pointer group">
                  <Upload className="h-6 w-6 text-white/20 group-hover:text-[#E50914]/50 transition-colors" />
                  {fileName ? (
                    <div className="text-center">
                      <p className="text-sm font-medium text-white/80">{fileName}</p>
                      <p className="text-[10px] text-[#E50914] mt-0.5">Fichier prêt · cliquez pour changer</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-xs text-white/40">Glissez un fichier ici ou cliquez pour importer</p>
                      <p className="text-[10px] text-white/20 mt-0.5">Formats acceptés : .srt .vtt</p>
                    </div>
                  )}
                  <input type="file" accept=".srt,.vtt" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </label>
              </div>

              <button
                onClick={handleUploadSubmit}
                disabled={isPending || !fileContent}
                className="w-full py-2.5 rounded-lg text-sm font-semibold bg-[#E50914] hover:bg-[#B20710] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Ajouter les sous-titres
              </button>
            </div>
          )}

          {/* Auto-generate mode */}
          {mode === 'auto' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                <AlertCircle className="h-4 w-4 text-amber-400/60 mt-0.5 shrink-0" />
                <p className="text-[11px] text-white/50 leading-relaxed">
                  La génération automatique analyse la piste audio du film et génère des sous-titres traduits via IA.
                  En production, ceci utilise Whisper + DeepL.
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-white/60 mb-2 block">Langues cibles</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => toggleAutoLang(lang.code)}
                      className={cn(
                        'flex flex-col items-center gap-0.5 p-2 rounded-lg text-[10px] font-medium border transition-all duration-200 relative',
                        autoLangs.includes(lang.code)
                          ? 'bg-[#E50914]/10 border-[#E50914]/40 text-[#E50914]'
                          : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]'
                      )}
                    >
                      {autoLangs.includes(lang.code) && (
                        <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#E50914] flex items-center justify-center">
                          <Check className="h-2 w-2 text-white" />
                        </div>
                      )}
                      <span className="text-base">{lang.flag}</span>
                      <span className="truncate w-full text-center">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
                {autoLangs.length > 0 && (
                  <p className="text-[10px] text-[#E50914] mt-1.5">
                    {autoLangs.length} langue(s) sélectionnée(s) · ~{(autoLangs.length * 12).toFixed(0)}s de traitement
                  </p>
                )}
              </div>

              <button
                onClick={handleAutoGenerate}
                disabled={isGenerating || autoLangs.length === 0}
                className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#E50914] to-[#B20710] text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:opacity-90"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Générer automatiquement
              </button>
            </div>
          )}
        </div>

        <div className="h-6" />
      </div>
    </div>
  )
}

/* ── Main Page ── */

export default function AdminSubtitlesPage() {
  const [films, setFilms] = useState<Film[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilm, setActiveFilm] = useState<Film | null>(null)
  const [search, setSearch] = useState('')

  // Simulate loading films with subtitle info (in prod, fetch from API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilms([
        {
          id: '1',
          title: 'La Dernière Lumière',
          slug: 'la-derniere-lumiere',
          thumbnailUrl: null,
          status: 'LIVE',
          subtitles: [
            { lang: 'fr', label: 'Français' },
            { lang: 'en', label: 'English' },
          ],
        },
        {
          id: '2',
          title: 'Nuit Éternelle',
          slug: 'nuit-eternelle',
          thumbnailUrl: null,
          status: 'LIVE',
          subtitles: [{ lang: 'fr', label: 'Français' }],
        },
        {
          id: '3',
          title: 'Le Dernier Témoin',
          slug: 'le-dernier-temoin',
          thumbnailUrl: null,
          status: 'PENDING',
          subtitles: [],
        },
        {
          id: '4',
          title: 'Horizon Perdu',
          slug: 'horizon-perdu',
          thumbnailUrl: null,
          status: 'LIVE',
          subtitles: [
            { lang: 'fr', label: 'Français' },
            { lang: 'en', label: 'English' },
            { lang: 'es', label: 'Español' },
            { lang: 'de', label: 'Deutsch' },
          ],
        },
        {
          id: '5',
          title: 'Ombres et Lumières',
          slug: 'ombres-et-lumieres',
          thumbnailUrl: null,
          status: 'LIVE',
          subtitles: [],
        },
      ])
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  function handleSuccess() {
    setActiveFilm(null)
    toast.success('Sous-titres mis à jour')
  }

  const filtered = films.filter(f =>
    !search || f.title.toLowerCase().includes(search.toLowerCase())
  )

  const totalWithSubs = films.filter(f => f.subtitles.length > 0).length
  const totalTracks = films.reduce((acc, f) => acc + f.subtitles.length, 0)

  const statusColors: Record<string, string> = {
    LIVE: 'border-green-500/30 bg-green-500/10 text-green-500',
    PENDING: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-500',
    APPROVED: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    REJECTED: 'border-red-500/30 bg-red-500/10 text-red-400',
    SUSPENDED: 'border-orange-500/30 bg-orange-500/10 text-orange-500',
  }

  return (
    <>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 font-[family-name:var(--font-playfair)]">
              Sous-titres
            </h1>
            <p className="text-white/50">Gestion des pistes de sous-titres pour les films du catalogue</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 flex items-center gap-2">
              <Film className="h-3.5 w-3.5 text-white/50" />
              <span className="text-white/60">{films.length} films</span>
            </div>
            <div className="rounded-lg border border-[#E50914]/20 bg-[#E50914]/5 px-3 py-2 flex items-center gap-2">
              <Languages className="h-3.5 w-3.5 text-[#E50914]" />
              <span className="text-[#E50914]">{totalTracks} pistes</span>
            </div>
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">{totalWithSubs} films sous-titrés</span>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
          <Globe className="h-4 w-4 text-blue-400/70 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/60 leading-relaxed">
              Les sous-titres sont stockés dans les tags du film (format <code className="text-[#E50914]/80 bg-[#E50914]/5 px-1 rounded">subtitle:lang:url</code>).
              Vous pouvez importer des fichiers .srt/.vtt ou lancer une génération automatique IA (Whisper + DeepL en production).
              12 langues supportées.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Film className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un film..."
            className="h-9 pl-9 pr-4 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 w-full"
          />
        </div>

        {/* Films table */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-6 w-6 text-white/20 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-white/40">
              <Film className="h-14 w-14 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucun film trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs text-white/40 font-medium p-4">Film</th>
                    <th className="text-center text-xs text-white/40 font-medium p-4">Statut</th>
                    <th className="text-left text-xs text-white/40 font-medium p-4">Pistes de sous-titres</th>
                    <th className="text-right text-xs text-white/40 font-medium p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(film => (
                    <tr key={film.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded bg-white/5 flex items-center justify-center shrink-0">
                            <Film className="h-4 w-4 text-white/20" />
                          </div>
                          <p className="text-sm font-medium">{film.title}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full border', statusColors[film.status] || 'border-white/10 bg-white/5 text-white/40')}>
                          {film.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {film.subtitles.length === 0 ? (
                            <span className="text-xs text-white/25 italic">Aucun sous-titre</span>
                          ) : (
                            film.subtitles.map(s => (
                              <SubtitleBadge key={s.lang} lang={s.lang} label={s.label} />
                            ))
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveFilm(film)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#E50914]/10 border border-[#E50914]/20 text-[#E50914] hover:bg-[#E50914]/20 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Ajouter
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Supported languages grid */}
        <div>
          <h2 className="text-base font-bold text-white/70 mb-4">Langues supportées</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {SUPPORTED_LANGUAGES.map(lang => (
              <div
                key={lang.code}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06]"
              >
                <span className="text-base">{lang.flag}</span>
                <div>
                  <p className="text-[10px] font-medium text-white/70">{lang.label}</p>
                  <p className="text-[9px] text-white/30">{lang.code.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add subtitle panel */}
      {activeFilm && (
        <AddSubtitlePanel
          film={activeFilm}
          onClose={() => setActiveFilm(null)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
