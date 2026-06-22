'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { EMAIL_TEMPLATES, EMAIL_SIGNATURES, ONBOARDING_SEQUENCE, BUSINESS_AGENTS } from '@/data/business-tools'
import type { EmailTemplate } from '@/data/business-tools'
import {
  Mail, Send, Copy, Check, Loader2, PenTool, Eye,
  Bot, Wand2, GitBranch, Search, ChevronRight,
  FileText, Clock, Users, Palette,
} from 'lucide-react'

export default function EmailStudioPage() {
  const [tab, setTab] = useState<'templates' | 'compose' | 'signatures' | 'sequences'>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({})
  const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const categories = Array.from(new Set(EMAIL_TEMPLATES.map(t => t.category)))
  const filtered = EMAIL_TEMPLATES
    .filter(t => filterCat === 'all' || t.category === filterCat)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))

  function selectTemplate(template: EmailTemplate) {
    setSelectedTemplate(template)
    setFieldValues({})
    setGeneratedEmail(null)
    setTab('compose')
  }

  function generateEmail() {
    if (!selectedTemplate) return
    setGenerating(true)
    setTimeout(() => {
      let subject = selectedTemplate.subject
      let body = selectedTemplate.body
      for (const [key, value] of Object.entries(fieldValues)) {
        const placeholder = `{${key}}`
        subject = subject.replaceAll(placeholder, value || `[${key}]`)
        body = body.replaceAll(placeholder, value || `[${key}]`)
      }
      // Replace remaining placeholders
      subject = subject.replace(/\{(\w+)\}/g, '[$1]')
      body = body.replace(/\{(\w+)\}/g, '[$1]')
      setGeneratedEmail({ subject, body })
      setGenerating(false)
      toast.success('Email généré')
    }, 1500)
  }

  async function copyEmail() {
    if (!generatedEmail) return
    await navigator.clipboard.writeText(`Objet: ${generatedEmail.subject}\n\n${generatedEmail.body}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Email copié')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Email Studio</h1>
          <p className="text-sm text-white/50 mt-1">{EMAIL_TEMPLATES.length} templates · Signatures · Séquences auto</p>
        </div>
      </div>

      {/* Agents */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {BUSINESS_AGENTS.slice(0, 3).map(a => (
          <div key={a.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 shrink-0">
            <Bot className="h-3.5 w-3.5" style={{ color: a.color }} />
            <div><p className="text-[10px] font-medium text-white">{a.name}</p><p className="text-[9px] text-white/40">{a.role}</p></div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'templates' as const, label: `Templates (${EMAIL_TEMPLATES.length})`, icon: FileText },
          { key: 'compose' as const, label: 'Rédiger', icon: PenTool },
          { key: 'signatures' as const, label: 'Signatures', icon: Palette },
          { key: 'sequences' as const, label: 'Séquences', icon: GitBranch },
        ].map(t => {
          const TIcon = t.icon
          return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}><TIcon className="h-3.5 w-3.5" />{t.label}</button>
        })}
      </div>

      {/* TEMPLATES */}
      {tab === 'templates' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 text-sm focus:border-[#E50914] focus:outline-none" /></div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-lg text-xs ${filterCat === 'all' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>Tous</button>
              {categories.map(cat => (<button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-lg text-xs capitalize ${filterCat === cat ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>{cat}</button>))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(template => (
              <button key={template.id} onClick={() => selectTemplate(template)} className="text-left rounded-xl border border-white/10 bg-white/5 p-5 hover:border-white/15 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-[#E50914]" />
                  <span className="text-sm font-medium text-white">{template.name}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-white/50 ml-auto" />
                </div>
                <p className="text-[10px] text-white/40 truncate">{template.subject}</p>
                <p className="text-[10px] text-white/40 mt-1">{template.category} · {template.variables.length} variables</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* COMPOSE */}
      {tab === 'compose' && selectedTemplate && (
        <div className="space-y-5 max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-1">{selectedTemplate.name}</h2>
            <p className="text-xs text-white/50 mb-4">Objet: {selectedTemplate.subject}</p>
            <div className="space-y-3">
              {selectedTemplate.variables.map(v => (
                <div key={v}>
                  <label className="text-xs text-white/50 mb-1 block capitalize">{v.replace(/([A-Z])/g, ' $1')}</label>
                  <input value={fieldValues[v] || ''} onChange={e => setFieldValues(p => ({ ...p, [v]: e.target.value }))} placeholder={v} className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
                </div>
              ))}
            </div>
            <button onClick={generateEmail} disabled={generating} className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-[#E50914] text-white font-semibold rounded-xl disabled:opacity-50">
              {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
              {generating ? 'Génération...' : 'Générer l\'email'}
            </button>
          </div>

          {generatedEmail && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Email prêt</h3>
                <button onClick={copyEmail} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] hover:bg-white/[0.08]">
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copié' : 'Copier'}
                </button>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-4">
                <p className="text-xs text-white/50 mb-1">Objet:</p>
                <p className="text-sm font-medium text-white mb-3">{generatedEmail.subject}</p>
                <p className="text-xs text-white/50 mb-1">Corps:</p>
                <pre className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed font-sans">{generatedEmail.body}</pre>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'compose' && !selectedTemplate && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <Mail className="h-10 w-10 text-white/40 mx-auto mb-3" />
          <p className="text-sm text-white/50">Sélectionnez un template pour commencer</p>
          <button onClick={() => setTab('templates')} className="mt-3 text-xs text-[#E50914] hover:underline">Voir les templates</button>
        </div>
      )}

      {/* SIGNATURES */}
      {tab === 'signatures' && (
        <div className="space-y-4">
          {EMAIL_SIGNATURES.map(sig => (
            <div key={sig.id} className="rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">{sig.name}</h3>
                <span className="text-[10px] text-white/40">{sig.style}</span>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-4" dangerouslySetInnerHTML={{ __html: sig.html.replace(/\{name\}/g, 'Votre Nom').replace(/\{title\}/g, 'Votre Titre').replace(/\{email\}/g, 'email@cinegen.com').replace(/\{phone\}/g, '+33 6 12 34 56 78') }} />
            </div>
          ))}
        </div>
      )}

      {/* SEQUENCES */}
      {tab === 'sequences' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><GitBranch className="h-5 w-5 text-green-500" />Séquence Onboarding</h2>
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/[0.08]" />
            {ONBOARDING_SEQUENCE.map((step, i) => {
              const template = EMAIL_TEMPLATES.find(t => t.id === step.templateId)
              return (
                <div key={i} className="relative mb-6">
                  <div className="absolute -left-5 h-6 w-6 rounded-full bg-white/5 border-2 border-[#E50914] flex items-center justify-center z-10">
                    <span className="text-[10px] font-bold text-[#E50914]">{step.day}</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5 ml-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-white/50" />
                      <span className="text-xs font-medium text-white">J+{step.day} — {template?.name}</span>
                      <span className="text-[10px] text-white/40 ml-auto">{step.trigger}</span>
                    </div>
                    <p className="text-xs text-white/50 truncate">{template?.subject}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
