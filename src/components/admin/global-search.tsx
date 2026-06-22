'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, ArrowRight, Users, Film, Bot, Shield, CreditCard, Settings, BarChart3, Activity, MessageSquare, Zap } from 'lucide-react'

interface SearchResult {
  title: string
  description: string
  href: string
  icon: typeof Users
  category: string
}

const ADMIN_ROUTES: SearchResult[] = [
  { title: 'Overview', description: 'Tableau de bord principal', href: '/admin/overview', icon: BarChart3, category: 'Dashboard' },
  { title: 'Users Management', description: 'Gestion des utilisateurs', href: '/admin/users/manage', icon: Users, category: 'Dashboard' },
  { title: 'Users (legacy)', description: 'Liste utilisateurs', href: '/admin/users', icon: Users, category: 'Dashboard' },
  { title: 'Films', description: 'Gestion des films', href: '/admin/films', icon: Film, category: 'Dashboard' },
  { title: 'Billing', description: 'Revenus et facturation', href: '/admin/billing', icon: CreditCard, category: 'Finance' },
  { title: 'Billing Enhanced', description: 'Analytics avec graphiques', href: '/admin/billing/enhanced', icon: BarChart3, category: 'Finance' },
  { title: 'Financial', description: 'KPIs financiers détaillés', href: '/admin/financial', icon: CreditCard, category: 'Finance' },
  { title: 'Guardrails', description: 'Monitoring protection', href: '/admin/guardrails', icon: Shield, category: 'System' },
  { title: 'Autopilot', description: 'Gouvernance autonome', href: '/admin/autopilot', icon: Bot, category: 'System' },
  { title: 'Diagnostics', description: 'Tests services live', href: '/admin/diagnostics', icon: Activity, category: 'System' },
  { title: 'Agents', description: 'Agents IA cinéma', href: '/agents', icon: Bot, category: 'Platform' },
  { title: 'Chat', description: 'Chat avec agents IA', href: '/chat', icon: MessageSquare, category: 'Platform' },
  { title: 'Credits / Wallet', description: 'Gestion crédits', href: '/credits', icon: CreditCard, category: 'Platform' },
  { title: 'Pricing IA', description: 'Tarifs transparents', href: '/pricing-ia', icon: Zap, category: 'Platform' },
  { title: 'Analytics', description: 'Analytics plateforme', href: '/admin/analytics', icon: BarChart3, category: 'Dashboard' },
  { title: 'Tasks', description: 'Gestion des tâches', href: '/admin/tasks', icon: Activity, category: 'Dashboard' },
  { title: 'Screenplays', description: 'Review scénarios', href: '/admin/screenplays', icon: Film, category: 'Dashboard' },
  { title: 'Settings', description: 'Paramètres admin', href: '/admin/settings', icon: Settings, category: 'System' },
  { title: 'Actors', description: 'Gestion acteurs IA', href: '/admin/actors', icon: Users, category: 'Dashboard' },
  { title: 'Contests', description: 'Concours', href: '/admin/contests', icon: Film, category: 'Dashboard' },
  { title: 'Reputation', description: 'Gestion réputation', href: '/admin/reputation', icon: Shield, category: 'Dashboard' },
  { title: 'Legal', description: 'Conformité juridique', href: '/admin/legal', icon: Shield, category: 'System' },
  { title: 'Setup Checklist', description: 'Configuration initiale', href: '/admin/setup', icon: Settings, category: 'System' },
  { title: 'Control Panel', description: 'Hub central admin', href: '/admin/control-panel', icon: Settings, category: 'System' },
  { title: 'Security / 2FA', description: 'Authentification 2 facteurs', href: '/admin/security', icon: Shield, category: 'System' },
  { title: 'Custom Agents', description: 'Agents utilisateurs', href: '/admin/custom-agents', icon: Bot, category: 'System' },
  { title: 'Modules Monitor', description: 'Modules utilisateurs', href: '/admin/modules', icon: Activity, category: 'System' },
]

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const filtered = query.trim()
    ? ADMIN_ROUTES.filter(r =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase())
      )
    : ADMIN_ROUTES.slice(0, 8)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  const navigate = useCallback((href: string) => {
    setOpen(false)
    router.push(href)
  }, [router])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex].href)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/[0.03] text-xs text-white/50 transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        Rechercher...
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-white/50 font-mono">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg">
        <div className="bg-white/5 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
            <Search className="h-5 w-5 text-white/50 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedIndex(0) }}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher dans l'admin..."
              className="flex-1 text-sm text-[#1A1A2E] placeholder-gray-400 bg-transparent focus:outline-none"
            />
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white/60">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-white/50">
                Aucun résultat pour &quot;{query}&quot;
              </div>
            ) : (
              filtered.map((result, i) => {
                const RIcon = result.icon
                return (
                  <button
                    key={result.href}
                    onClick={() => navigate(result.href)}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                      i === selectedIndex ? 'bg-[#E50914]/5' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <RIcon className={`h-4 w-4 shrink-0 ${i === selectedIndex ? 'text-[#E50914]' : 'text-white/50'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${i === selectedIndex ? 'text-[#E50914]' : 'text-[#1A1A2E]'}`}>{result.title}</p>
                      <p className="text-[10px] text-white/50 truncate">{result.description}</p>
                    </div>
                    <span className="text-[10px] text-gray-300 shrink-0">{result.category}</span>
                    {i === selectedIndex && <ArrowRight className="h-3.5 w-3.5 text-[#E50914] shrink-0" />}
                  </button>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-2.5 border-t border-white/10 flex items-center gap-4 text-[10px] text-white/50">
            <span>↑↓ naviguer</span>
            <span>↵ ouvrir</span>
            <span>esc fermer</span>
          </div>
        </div>
      </div>
    </div>
  )
}
