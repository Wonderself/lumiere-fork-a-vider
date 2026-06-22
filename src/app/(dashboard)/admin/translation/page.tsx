'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { TRANSLATION_LANGUAGES, BUSINESS_AGENTS } from '@/data/business-tools'
import {
  Languages, Send, Loader2, Copy, Check, AlertTriangle,
  Bot, ArrowRight, Shield, RefreshCcw, FileText,
} from 'lucide-react'

export default function TranslationPage() {
  const [sourceText, setSourceText] = useState('')
  const [sourceLang, setSourceLang] = useState('fr')
  const [targetLang, setTargetLang] = useState('en')
  const [translatedText, setTranslatedText] = useState('')
  const [translating, setTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<'text' | 'subtitle' | 'pitch'>('text')

  const targetConfig = TRANSLATION_LANGUAGES.find(l => l.code === targetLang)

  async function translate() {
    if (!sourceText.trim()) { toast.error('Saisissez du texte'); return }
    setTranslating(true)
    await new Promise(r => setTimeout(r, 2000))
    const sourceName = TRANSLATION_LANGUAGES.find(l => l.code === sourceLang)?.name || sourceLang
    const targetName = targetConfig?.name || targetLang
    setTranslatedText(`[Traduction ${sourceName} → ${targetName} — ${mode}]\n\n${sourceText.substring(0, 200)}...\n\n[En production, cette traduction sera réalisée par l'agent Traducteur Culturel avec prise en compte des sensibilités culturelles du marché ${targetName}.\n\nMode: ${mode === 'subtitle' ? 'Sous-titrage (contraintes timing/caractères)' : mode === 'pitch' ? 'Pitch multilingue (adaptation ton business)' : 'Traduction standard'}]`)
    setTranslating(false)
    toast.success(`Traduit en ${targetName}`)
  }

  async function copyText() {
    await navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Traduction & Adaptation</h1>
        <p className="text-sm text-white/50 mt-1">{TRANSLATION_LANGUAGES.length} langues · Adaptation culturelle · Alertes sensibilité</p>
      </div>

      {/* Agents */}
      <div className="flex gap-2">
        {BUSINESS_AGENTS.slice(4, 6).map(a => (
          <div key={a.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5">
            <Bot className="h-3.5 w-3.5" style={{ color: a.color }} />
            <div><p className="text-[10px] font-medium text-white">{a.name}</p><p className="text-[9px] text-white/40">{a.role}</p></div>
          </div>
        ))}
      </div>

      {/* Mode */}
      <div className="flex gap-2">
        {[
          { key: 'text' as const, label: 'Texte', icon: FileText },
          { key: 'subtitle' as const, label: 'Sous-titres', icon: Languages },
          { key: 'pitch' as const, label: 'Pitch multilingue', icon: Send },
        ].map(m => {
          const MIcon = m.icon
          return <button key={m.key} onClick={() => setMode(m.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium ${mode === m.key ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}><MIcon className="h-3.5 w-3.5" />{m.label}</button>
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm">
              {TRANSLATION_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
            </select>
            <button onClick={() => { const tmp = sourceLang; setSourceLang(targetLang); setTargetLang(tmp) }} className="p-2 rounded-lg hover:bg-white/[0.05]"><RefreshCcw className="h-4 w-4 text-white/40" /></button>
            <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm">
              {TRANSLATION_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
            </select>
          </div>

          <textarea value={sourceText} onChange={e => setSourceText(e.target.value)} placeholder={`Texte en ${TRANSLATION_LANGUAGES.find(l => l.code === sourceLang)?.name}...`} rows={10} className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm focus:border-[#E50914] focus:outline-none resize-none" />

          <button onClick={translate} disabled={translating || !sourceText.trim()} className="w-full flex items-center justify-center gap-2 py-3 bg-[#E50914] text-white font-semibold rounded-xl disabled:opacity-50">
            {translating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Languages className="h-5 w-5" />}
            {translating ? 'Traduction...' : 'Traduire'}
          </button>
        </div>

        {/* Target + Sensitivity */}
        <div className="space-y-3">
          {/* Sensitivity Notes */}
          {targetConfig && targetConfig.sensitivityNotes.length > 0 && (
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-400">Sensibilités culturelles — {targetConfig.name}</span>
              </div>
              <ul className="space-y-1">
                {targetConfig.sensitivityNotes.map((note, i) => (
                  <li key={i} className="text-[10px] text-yellow-400/80 flex items-start gap-1.5">
                    <Shield className="h-3 w-3 mt-0.5 shrink-0 text-yellow-500/70" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {translatedText ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-white/50">{targetConfig?.flag} {targetConfig?.name}</span>
                <button onClick={copyText} className="flex items-center gap-1 text-xs text-white/50 hover:text-white">
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
              <pre className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed font-sans">{translatedText}</pre>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center h-[280px] flex items-center justify-center">
              <div>
                <Languages className="h-8 w-8 text-white/40 mx-auto mb-2" />
                <p className="text-sm text-white/50">La traduction apparaitra ici</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All Languages Grid */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">{TRANSLATION_LANGUAGES.length} langues supportées</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {TRANSLATION_LANGUAGES.map(lang => (
            <div key={lang.code} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
              <span className="text-2xl">{lang.flag}</span>
              <p className="text-xs font-medium text-white mt-1">{lang.name}</p>
              <p className="text-[10px] text-white/40">{lang.nativeName}</p>
              {lang.sensitivityNotes.length > 0 && <AlertTriangle className="h-3 w-3 text-yellow-600 mx-auto mt-1" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
