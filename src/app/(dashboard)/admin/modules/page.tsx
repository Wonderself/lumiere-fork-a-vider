'use client'

import { useState } from 'react'
import {
  Layout, Bot, Users, BarChart3, FileText,
  CheckCircle2, XCircle, Clock, Activity, Search,
} from 'lucide-react'

interface UserModule {
  id: string
  name: string
  type: 'form' | 'crm' | 'agent' | 'dashboard'
  creator: string
  status: 'active' | 'draft' | 'error'
  usageCount: number
  lastUsed: Date
  createdAt: Date
}

const MOCK_MODULES: UserModule[] = [
  { id: '1', name: 'Script Submission Form', type: 'form', creator: 'admin@admin.com', status: 'active', usageCount: 234, lastUsed: new Date(), createdAt: new Date(Date.now() - 30 * 86400000) },
  { id: '2', name: 'Investor CRM', type: 'crm', creator: 'producer@film.com', status: 'active', usageCount: 89, lastUsed: new Date(Date.now() - 86400000), createdAt: new Date(Date.now() - 60 * 86400000) },
  { id: '3', name: 'Review Agent', type: 'agent', creator: 'editor@studio.com', status: 'draft', usageCount: 12, lastUsed: new Date(Date.now() - 7 * 86400000), createdAt: new Date(Date.now() - 14 * 86400000) },
  { id: '4', name: 'Production Dashboard', type: 'dashboard', creator: 'admin@admin.com', status: 'active', usageCount: 567, lastUsed: new Date(), createdAt: new Date(Date.now() - 90 * 86400000) },
  { id: '5', name: 'Casting Form', type: 'form', creator: 'casting@film.com', status: 'error', usageCount: 45, lastUsed: new Date(Date.now() - 3 * 86400000), createdAt: new Date(Date.now() - 21 * 86400000) },
  { id: '6', name: 'VFX Pipeline Agent', type: 'agent', creator: 'vfx@studio.com', status: 'active', usageCount: 78, lastUsed: new Date(Date.now() - 3600000), createdAt: new Date(Date.now() - 45 * 86400000) },
]

const TYPE_CONFIG = {
  form: { label: 'Form', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  crm: { label: 'CRM', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  agent: { label: 'Agent', icon: Bot, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  dashboard: { label: 'Dashboard', icon: BarChart3, color: 'text-green-400', bg: 'bg-green-500/10' },
}

export default function ModulesMonitorPage() {
  const [modules] = useState<UserModule[]>(MOCK_MODULES)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')

  const filtered = modules
    .filter(m => filterType === 'all' || m.type === filterType)
    .filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()))

  const kpis = [
    { label: 'Total Modules', value: modules.length, icon: Layout, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Actifs', value: modules.filter(m => m.status === 'active').length, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Usage', value: modules.reduce((s, m) => s + m.usageCount, 0), icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'En erreur', value: modules.filter(m => m.status === 'error').length, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Modules Monitor</h1>
        <p className="text-sm text-white/50 mt-1">Modules créés par les utilisateurs (forms, CRM, agents, dashboards)</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className={`rounded-xl border border-white/10 ${kpi.bg} p-4 text-center`}>
              <Icon className={`h-5 w-5 ${kpi.color} mx-auto mb-1`} />
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
              <p className="text-[10px] text-white/50">{kpi.label}</p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 text-sm focus:border-[#E50914] focus:outline-none" />
        </div>
        <div className="flex gap-1">
          {['all', 'form', 'crm', 'agent', 'dashboard'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${filterType === type ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'}`}
            >
              {type === 'all' ? 'Tous' : TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]?.label || type}
            </button>
          ))}
        </div>
      </div>

      {/* Modules List */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="divide-y divide-white/10">
          {filtered.map(mod => {
            const tc = TYPE_CONFIG[mod.type]
            const TIcon = tc.icon
            return (
              <div key={mod.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors">
                <div className={`h-10 w-10 rounded-xl ${tc.bg} flex items-center justify-center`}>
                  <TIcon className={`h-5 w-5 ${tc.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{mod.name}</p>
                  <p className="text-[10px] text-white/50">{mod.creator} · Créé {mod.createdAt.toLocaleDateString('fr-FR')}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${tc.bg} ${tc.color} font-medium`}>{tc.label}</span>
                <div className="text-right">
                  <p className="text-xs font-medium text-white">{mod.usageCount} uses</p>
                  <p className="text-[10px] text-white/50">{mod.lastUsed.toLocaleDateString('fr-FR')}</p>
                </div>
                <div className={`h-2.5 w-2.5 rounded-full ${mod.status === 'active' ? 'bg-green-500' : mod.status === 'error' ? 'bg-red-500' : 'bg-white/30'}`} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
