'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { PIPELINE_STAGES, CONTACT_TYPES, PRODUCTIVITY_AGENTS } from '@/data/productivity'
import type { PipelineStage, ContactType } from '@/data/productivity'
import {
  Users, Plus, Search, Mail, Calendar, FileText,
  MessageCircle, CheckCircle2, XCircle, UserPlus,
  Globe, Award, Newspaper, Star, TrendingUp,
  Phone, MapPin, Clock, Tag, Trash2, Edit, Bot,
  ChevronRight, Filter, MoreHorizontal,
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  company: string
  email: string
  phone: string
  type: ContactType
  stage: PipelineStage
  notes: string
  lastContact: Date | null
  nextFollowUp: Date | null
  value: number
  tags: string[]
  createdAt: Date
}

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Sophie Martin', company: 'Canal+ Invest', email: 'sophie@canal.fr', phone: '+33612345678', type: 'investor', stage: 'negotiation', notes: 'Intéressée par les films IA', lastContact: new Date(Date.now() - 86400000), nextFollowUp: new Date(Date.now() + 172800000), value: 50000, tags: ['prioritaire', 'cinéma IA'], createdAt: new Date(Date.now() - 30 * 86400000) },
  { id: '2', name: 'Marc Dupont', company: 'Wild Bunch', email: 'marc@wildbunch.eu', phone: '+33698765432', type: 'distributor', stage: 'proposal', notes: 'Distribution Europe', lastContact: new Date(Date.now() - 3 * 86400000), nextFollowUp: new Date(Date.now() + 86400000), value: 30000, tags: ['europe', 'VOD'], createdAt: new Date(Date.now() - 60 * 86400000) },
  { id: '3', name: 'Lisa Chen', company: 'A24 Asia', email: 'lisa@a24.com', phone: '', type: 'partner', stage: 'meeting', notes: 'Partenariat tech', lastContact: new Date(Date.now() - 7 * 86400000), nextFollowUp: null, value: 0, tags: ['tech', 'international'], createdAt: new Date(Date.now() - 14 * 86400000) },
  { id: '4', name: 'Festival de Cannes', company: 'FDC', email: 'submissions@festival-cannes.fr', phone: '', type: 'festival', stage: 'lead', notes: 'Deadline février', lastContact: null, nextFollowUp: new Date('2027-02-01'), value: 0, tags: ['A-list', 'prioritaire'], createdAt: new Date() },
  { id: '5', name: 'Pierre Lemaire', company: 'Le Monde Cinéma', email: 'plemaire@lemonde.fr', phone: '+33611223344', type: 'press', stage: 'contacted', notes: 'Article sur le cinéma participatif', lastContact: new Date(Date.now() - 5 * 86400000), nextFollowUp: new Date(Date.now() + 3 * 86400000), value: 0, tags: ['presse nationale'], createdAt: new Date(Date.now() - 10 * 86400000) },
]

export default function CRMPage() {
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS)
  const [view, setView] = useState<'pipeline' | 'list' | 'add'>('pipeline')
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [newContact, setNewContact] = useState({ name: '', company: '', email: '', phone: '', type: 'investor' as ContactType, notes: '' })

  const filtered = contacts
    .filter(c => filterType === 'all' || c.type === filterType)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()))

  function addContact() {
    if (!newContact.name.trim()) { toast.error('Nom requis'); return }
    setContacts(prev => [...prev, {
      ...newContact, id: `c-${Date.now()}`, stage: 'lead', lastContact: null,
      nextFollowUp: null, value: 0, tags: [], createdAt: new Date(),
    }])
    setNewContact({ name: '', company: '', email: '', phone: '', type: 'investor', notes: '' })
    setView('pipeline')
    toast.success('Contact ajouté')
  }

  function moveContact(id: string, newStage: PipelineStage) {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, stage: newStage } : c))
    toast.success('Contact déplacé')
  }

  const TYPE_ICONS: Record<string, typeof Users> = {
    investor: TrendingUp, distributor: Globe, partner: Users,
    festival: Award, press: Newspaper, talent: Star,
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">CRM Cinéma</h1>
          <p className="text-sm text-white/50 mt-1">{contacts.length} contacts · Pipeline investisseurs, distributeurs, partenaires</p>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'pipeline' as const, label: 'Pipeline' },
            { key: 'list' as const, label: 'Liste' },
            { key: 'add' as const, label: '+ Contact' },
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${view === v.key ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}>{v.label}</button>
          ))}
        </div>
      </div>

      {/* Agents */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {PRODUCTIVITY_AGENTS.slice(0, 3).map(a => (
          <div key={a.slug} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 shrink-0">
            <Bot className="h-3.5 w-3.5" style={{ color: a.color }} />
            <div>
              <p className="text-[10px] font-medium text-white">{a.name}</p>
              <p className="text-[9px] text-white/50">{a.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      {view !== 'add' && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 text-sm focus:border-[#E50914] focus:outline-none" />
          </div>
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => setFilterType('all')} className={`px-3 py-1.5 rounded-lg text-xs ${filterType === 'all' ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>Tous</button>
            {CONTACT_TYPES.map(ct => (
              <button key={ct.id} onClick={() => setFilterType(ct.id)} className={`px-3 py-1.5 rounded-lg text-xs ${filterType === ct.id ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>{ct.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* PIPELINE VIEW */}
      {view === 'pipeline' && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(stage => {
            const stageContacts = filtered.filter(c => c.stage === stage.id)
            return (
              <div key={stage.id} className="min-w-[250px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span className="text-xs font-semibold text-white">{stage.label}</span>
                  <span className="text-[10px] text-white/50 ml-auto">{stageContacts.length}</span>
                </div>
                <div className="space-y-2">
                  {stageContacts.map(contact => {
                    const CIcon = TYPE_ICONS[contact.type] || Users
                    return (
                      <div key={contact.id} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <CIcon className="h-4 w-4" style={{ color: CONTACT_TYPES.find(t => t.id === contact.type)?.color }} />
                          <p className="text-sm font-medium text-white truncate flex-1">{contact.name}</p>
                        </div>
                        <p className="text-[10px] text-white/50 mb-2">{contact.company}</p>
                        {contact.value > 0 && <p className="text-xs font-semibold text-[#E50914] mb-1">€{contact.value.toLocaleString()}</p>}
                        <div className="flex gap-1 mb-2">
                          {contact.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/50">{tag}</span>
                          ))}
                        </div>
                        {contact.nextFollowUp && (
                          <p className="text-[10px] text-orange-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Relance: {contact.nextFollowUp.toLocaleDateString('fr-FR')}
                          </p>
                        )}
                        {/* Quick stage move */}
                        <div className="flex gap-1 mt-2">
                          {PIPELINE_STAGES.filter(s => s.id !== contact.stage).slice(0, 3).map(s => (
                            <button key={s.id} onClick={() => moveContact(contact.id, s.id)} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.03] text-white/50 hover:bg-white/[0.05]" title={`→ ${s.label}`}>
                              → {s.label.substring(0, 4)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  {stageContacts.length === 0 && (
                    <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-[10px] text-white/50">Vide</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/10">
                <th className="text-left text-[10px] font-medium text-white/50 uppercase px-5 py-3">Contact</th>
                <th className="text-left text-[10px] font-medium text-white/50 uppercase px-5 py-3">Type</th>
                <th className="text-left text-[10px] font-medium text-white/50 uppercase px-5 py-3">Stage</th>
                <th className="text-right text-[10px] font-medium text-white/50 uppercase px-5 py-3">Valeur</th>
                <th className="text-right text-[10px] font-medium text-white/50 uppercase px-5 py-3">Relance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map(c => {
                const stageConf = PIPELINE_STAGES.find(s => s.id === c.stage)
                const typeConf = CONTACT_TYPES.find(t => t.id === c.type)
                return (
                  <tr key={c.id} className="hover:bg-white/[0.03]">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-white">{c.name}</p>
                      <p className="text-[10px] text-white/50">{c.company} · {c.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${typeConf?.color}15`, color: typeConf?.color }}>{typeConf?.label}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${stageConf?.color}15`, color: stageConf?.color }}>{stageConf?.label}</span>
                    </td>
                    <td className="px-5 py-3 text-right text-sm font-medium text-white">{c.value > 0 ? `€${c.value.toLocaleString()}` : '—'}</td>
                    <td className="px-5 py-3 text-right text-[10px] text-white/50">{c.nextFollowUp ? c.nextFollowUp.toLocaleDateString('fr-FR') : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD VIEW */}
      {view === 'add' && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5 max-w-xl">
          <h2 className="text-lg font-semibold text-white">Nouveau contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Nom *</label>
              <input value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} placeholder="Prénom Nom" className="w-full rounded-xl border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Entreprise</label>
              <input value={newContact.company} onChange={e => setNewContact(p => ({ ...p, company: e.target.value }))} placeholder="Société" className="w-full rounded-xl border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Email</label>
              <input type="email" value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} placeholder="email@..." className="w-full rounded-xl border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Téléphone</label>
              <input value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} placeholder="+33..." className="w-full rounded-xl border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Type</label>
            <div className="flex gap-2 flex-wrap">
              {CONTACT_TYPES.map(ct => (
                <button key={ct.id} onClick={() => setNewContact(p => ({ ...p, type: ct.id }))} className={`px-3 py-1.5 rounded-lg text-xs ${newContact.type === ct.id ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}>{ct.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Notes</label>
            <textarea value={newContact.notes} onChange={e => setNewContact(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Notes..." className="w-full rounded-xl border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none resize-none" />
          </div>
          <button onClick={addContact} className="w-full py-3 bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold rounded-xl transition-colors">Ajouter le contact</button>
        </div>
      )}
    </div>
  )
}
