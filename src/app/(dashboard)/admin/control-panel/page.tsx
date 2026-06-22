import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  BarChart3, Users, Film, Bot, Shield, CreditCard, Activity,
  Settings, Zap, MessageSquare, Star, Eye, Crown, Flag,
  Server, Database, Mail, Phone, Globe, FileText, Music,
  Camera, Scissors, Award, Heart, Target, Store, TrendingUp,
  Lock, Bell, Briefcase, Layout, Cpu, Radio,
} from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Control Panel — Admin CINEGENY' }

type PageStatus = 'functional' | 'partial' | 'stub'

interface AdminRoute {
  href: string
  label: string
  icon: typeof Users
  status: PageStatus
  category: string
}

const ROUTES: AdminRoute[] = [
  // Dashboard
  { href: '/admin', label: 'Admin Home', icon: Layout, status: 'functional', category: 'Dashboard' },
  { href: '/admin/overview', label: 'Overview', icon: BarChart3, status: 'functional', category: 'Dashboard' },
  { href: '/admin/analytics', label: 'Analytics', icon: Activity, status: 'functional', category: 'Dashboard' },
  { href: '/admin/pilotage', label: 'Pilotage', icon: Target, status: 'functional', category: 'Dashboard' },
  { href: '/admin/todo-fondateur', label: 'Todo Fondateur', icon: FileText, status: 'functional', category: 'Dashboard' },
  // Users
  { href: '/admin/users', label: 'Users List', icon: Users, status: 'functional', category: 'Users' },
  { href: '/admin/users/manage', label: 'Users Management', icon: Users, status: 'functional', category: 'Users' },
  { href: '/admin/reputation', label: 'Reputation', icon: Star, status: 'functional', category: 'Users' },
  // Films
  { href: '/admin/films', label: 'Films CRUD', icon: Film, status: 'functional', category: 'Content' },
  { href: '/admin/actors', label: 'Actors', icon: Users, status: 'functional', category: 'Content' },
  { href: '/admin/screenplays', label: 'Screenplays', icon: FileText, status: 'functional', category: 'Content' },
  { href: '/admin/bonus-content', label: 'Bonus Content', icon: Star, status: 'functional', category: 'Content' },
  { href: '/admin/catalog', label: 'Catalog', icon: Film, status: 'functional', category: 'Content' },
  { href: '/admin/contests', label: 'Contests', icon: Award, status: 'functional', category: 'Content' },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare, status: 'functional', category: 'Content' },
  // Tasks
  { href: '/admin/tasks', label: 'Tasks', icon: Zap, status: 'functional', category: 'Tasks' },
  { href: '/admin/interventions', label: 'Interventions', icon: Shield, status: 'functional', category: 'Tasks' },
  // Finance
  { href: '/admin/billing', label: 'Billing', icon: CreditCard, status: 'functional', category: 'Finance' },
  { href: '/admin/billing/enhanced', label: 'Billing Charts', icon: BarChart3, status: 'functional', category: 'Finance' },
  { href: '/admin/financial', label: 'Financial KPIs', icon: TrendingUp, status: 'functional', category: 'Finance' },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard, status: 'functional', category: 'Finance' },
  { href: '/admin/payouts', label: 'Payouts', icon: CreditCard, status: 'functional', category: 'Finance' },
  { href: '/admin/funding', label: 'Funding', icon: Briefcase, status: 'functional', category: 'Finance' },
  // Tokenization
  { href: '/admin/tokenization', label: 'Tokenization', icon: Crown, status: 'functional', category: 'Blockchain' },
  { href: '/admin/film-tokenizer', label: 'Film Tokenizer', icon: Crown, status: 'functional', category: 'Blockchain' },
  // AI & Agents
  { href: '/agents', label: 'Agents Browse', icon: Bot, status: 'functional', category: 'AI' },
  { href: '/chat', label: 'Chat IA', icon: MessageSquare, status: 'functional', category: 'AI' },
  { href: '/chat/meeting', label: 'Multi-Agent Meeting', icon: Users, status: 'functional', category: 'AI' },
  { href: '/admin/ai-automation', label: 'AI Automation', icon: Cpu, status: 'functional', category: 'AI' },
  { href: '/admin/custom-agents', label: 'Custom Agents', icon: Bot, status: 'functional', category: 'AI' },
  { href: '/admin/modules', label: 'Modules Monitor', icon: Layout, status: 'functional', category: 'AI' },
  // System
  { href: '/admin/guardrails', label: 'Guardrails', icon: Shield, status: 'functional', category: 'System' },
  { href: '/admin/autopilot', label: 'Autopilot', icon: Bot, status: 'functional', category: 'System' },
  { href: '/admin/diagnostics', label: 'Diagnostics', icon: Activity, status: 'functional', category: 'System' },
  { href: '/admin/security', label: 'Security & 2FA', icon: Lock, status: 'functional', category: 'System' },
  { href: '/admin/setup', label: 'Setup Checklist', icon: Settings, status: 'functional', category: 'System' },
  { href: '/admin/control-panel', label: 'Control Panel', icon: Radio, status: 'functional', category: 'System' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, status: 'functional', category: 'System' },
  { href: '/admin/legal', label: 'Legal', icon: Shield, status: 'functional', category: 'System' },
  // Public pages (admin reference)
  { href: '/pricing-ia', label: 'Pricing IA', icon: Zap, status: 'functional', category: 'Public' },
  { href: '/credits', label: 'Wallet & Credits', icon: CreditCard, status: 'functional', category: 'Public' },
  { href: '/agents/marketplace', label: 'Marketplace', icon: Store, status: 'functional', category: 'Public' },
]

const STATUS_CONFIG: Record<PageStatus, { label: string; color: string; bg: string }> = {
  functional: { label: 'Fonctionnel', color: 'text-green-400', bg: 'bg-green-500/10' },
  partial: { label: 'Partiel', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  stub: { label: 'Stub', color: 'text-white/50', bg: 'bg-white/[0.03]' },
}

export default async function ControlPanelPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  const categories = Array.from(new Set(ROUTES.map(r => r.category)))
  const stats = {
    functional: ROUTES.filter(r => r.status === 'functional').length,
    partial: ROUTES.filter(r => r.status === 'partial').length,
    stub: ROUTES.filter(r => r.status === 'stub').length,
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Control Panel</h1>
        <p className="text-sm text-white/50 mt-1">Hub central — {ROUTES.length} routes admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <div key={key} className={`rounded-xl border border-white/10 ${config.bg} px-5 py-3`}>
            <span className={`text-2xl font-bold ${config.color}`}>{stats[key as PageStatus]}</span>
            <span className="text-xs text-white/50 ml-2">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Routes by Category */}
      {categories.map(cat => {
        const catRoutes = ROUTES.filter(r => r.category === cat)
        return (
          <div key={cat}>
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {catRoutes.map(route => {
                const RIcon = route.icon
                const sc = STATUS_CONFIG[route.status]
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-colors"
                  >
                    <RIcon className="h-4 w-4 text-white/50 shrink-0" />
                    <span className="text-sm text-white flex-1 truncate">{route.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${sc.bg} ${sc.color} font-medium shrink-0`}>{sc.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
