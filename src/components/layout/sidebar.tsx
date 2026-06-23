'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  Star,
  User,
  CreditCard,
  Trophy,
  Film,
  Settings,
  Users,
  ClipboardCheck,
  BarChart3,
  Sun,
  Bell,
  FileText,
  Landmark,
  Wallet,
  TrendingUp,
  Heart,
  Clapperboard,
  Wand2,
  Play,
  Shield,
  DollarSign,
  AlertTriangle,
  Menu,
  X,
  Coins,
  Vote,
  Scale,
  Bot,
  UserCircle2,
  Scroll,
  Home,
  Compass,
  // New icons for added sections
  ChevronDown,
  ChevronRight,
  Cpu,
  Plane,
  Lock,
  Sliders,
  Network,
  Workflow,
  ShieldCheck,
  Wrench,
  PanelLeftClose,
  Receipt,
  LineChart,
  BadgeDollarSign,
  Tag,
  Mail,
  Megaphone,
  Share2,
  BellRing,
  BookOpen,
  HardHat,
  Hammer,
  Database,
  Languages,
  Image,
  GraduationCap,
  Blocks,
  Puzzle,
  Building2,
  FolderOpen,
  MessageSquare,
  Map,
  MessagesSquare,
  CheckSquare,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { useState, useEffect } from 'react'

const LEVEL_LABELS_MAP: Record<string, string> = {
  ROOKIE: 'Rookie',
  PRO: 'Pro',
  EXPERT: 'Expert',
  VIP: 'VIP',
}

type NavLink = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  exact?: boolean
  badge?: string
}

type NavSection = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  dotColor: string
  links: NavLink[]
}

// ======= MAIN USER NAVIGATION (4 sections cinema) =======
const mainNavSections: NavSection[] = [
  {
    title: 'Home',
    icon: Home,
    dotColor: 'bg-[#E50914]',
    links: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
      { href: '/streaming', label: 'Streaming', icon: Play },
      { href: '/notifications', label: 'Notifications', icon: Bell },
    ],
  },
  {
    title: 'Cinema',
    icon: Clapperboard,
    dotColor: 'bg-[#8B5CF6]',
    links: [
      { href: '/trailer-studio', label: 'Trailer Studio', icon: Wand2, badge: 'NEW' },
      { href: '/tasks', label: 'Micro-tasks', icon: Star },
      { href: '/films', label: 'Films', icon: Film },
      { href: '/screenplays', label: 'Screenplays', icon: FileText },
    ],
  },
  {
    title: 'Discover',
    icon: Compass,
    dotColor: 'bg-[#F43F5E]',
    links: [
      { href: '/vote', label: 'Vote', icon: Vote },
      { href: '/academy', label: 'Academy', icon: GraduationCap },
      { href: '/community', label: 'Community', icon: Heart, exact: true },
      { href: '/community/contests', label: 'Contests', icon: Trophy },
      { href: '/community/scenarios', label: 'Screenplay votes', icon: Scroll },
      { href: '/actors', label: 'AI Actors', icon: UserCircle2 },
      { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    ],
  },
  {
    title: 'My Account',
    icon: User,
    dotColor: 'bg-[#10B981]',
    links: [
      { href: '/profile', label: 'Profile', icon: User },
      { href: '/credits', label: 'AI Credits', icon: Coins, badge: 'NEW' },
      { href: '/profile/payments', label: 'Payments', icon: CreditCard },
      { href: '/lumens', label: 'My Lumens', icon: Sun },
      { href: '/tokenization', label: 'Invest', icon: Coins, exact: true },
      { href: '/tokenization/portfolio', label: 'Portfolio', icon: Wallet },
      { href: '/tokenization/governance', label: 'Governance', icon: Vote },
    ],
  },
]

// ======= ADMIN NAVIGATION =======
const adminNavSections: NavSection[] = [
  {
    title: 'Administration',
    icon: BarChart3,
    dotColor: 'bg-orange-400',
    links: [
      { href: '/admin', label: 'Overview', icon: BarChart3, exact: true },
      { href: '/admin/interventions', label: 'Interventions', icon: AlertTriangle },
      { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    ],
  },
  {
    title: 'Content',
    icon: Film,
    dotColor: 'bg-[#E50914]',
    links: [
      { href: '/admin/films', label: 'Studio films', icon: Film },
      { href: '/admin/tasks', label: 'Tasks', icon: Star },
      { href: '/admin/screenplays', label: 'Screenplays', icon: FileText },
      { href: '/admin/catalog', label: 'Streaming catalog', icon: Play },
    ],
  },
  {
    title: 'Film universe',
    icon: Clapperboard,
    dotColor: 'bg-rose-400',
    links: [
      { href: '/admin/actors', label: 'AI Actors', icon: UserCircle2 },
      { href: '/admin/bonus-content', label: 'Bonus Content', icon: Clapperboard },
      { href: '/admin/contests', label: 'Contests', icon: Trophy },
    ],
  },
  {
    title: 'Users & finance',
    icon: Users,
    dotColor: 'bg-green-400',
    links: [
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/reputation', label: 'Reputation', icon: Shield },
      { href: '/admin/payments', label: 'Payments', icon: Wallet },
      { href: '/admin/payouts', label: 'Payouts', icon: DollarSign },
      { href: '/admin/reviews', label: 'AI reviews', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Tokenization & Legal',
    icon: Coins,
    dotColor: 'bg-amber-400',
    links: [
      { href: '/admin/tokenization', label: 'Film tokens', icon: Coins },
      { href: '/admin/legal', label: 'Legal compliance', icon: Scale },
      { href: '/admin/ai-automation', label: 'AI automation', icon: Bot },
      { href: '/admin/film-tokenizer', label: 'Film tokenizer', icon: Wand2 },
    ],
  },
  {
    title: 'System',
    icon: Settings,
    dotColor: 'bg-gray-400',
    links: [
      { href: '/admin/pilotage', label: 'Steering & grants', icon: Landmark, badge: 'NEW' },
      { href: '/admin/funding', label: 'Public grants', icon: Landmark },
      { href: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
]

// ======= EXTENDED ADMIN SECTIONS (collapsible) =======
type CollapsibleNavSection = NavSection & { collapsible: true; defaultOpen?: boolean }

const extendedAdminSections: CollapsibleNavSection[] = [
  {
    collapsible: true,
    defaultOpen: false,
    title: 'Système & Infrastructure',
    icon: Cpu,
    dotColor: 'bg-sky-400',
    links: [
      { href: '/admin/overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
      { href: '/admin/autopilot', label: 'Autopilot IA', icon: Plane },
      { href: '/admin/guardrails', label: 'Guardrails', icon: ShieldCheck },
      { href: '/admin/diagnostics', label: 'Diagnostics', icon: Sliders },
      { href: '/admin/infrastructure', label: 'Infrastructure', icon: Network },
      { href: '/admin/orchestration', label: 'Orchestration', icon: Workflow },
      { href: '/admin/security', label: 'Security', icon: Lock },
      { href: '/admin/setup', label: 'Configuration', icon: Wrench },
      { href: '/admin/control-panel', label: 'Control Panel', icon: PanelLeftClose },
    ],
  },
  {
    collapsible: true,
    defaultOpen: false,
    title: 'Finance & Business',
    icon: BadgeDollarSign,
    dotColor: 'bg-emerald-400',
    links: [
      { href: '/admin/billing', label: 'Billing', icon: Receipt },
      { href: '/admin/billing/enhanced', label: 'Revenus détaillés', icon: LineChart },
      { href: '/admin/financial', label: 'Finance', icon: BadgeDollarSign },
      { href: '/admin/invoicing', label: 'Devis & Factures', icon: FileText },
      { href: '/admin/promo-codes', label: 'Codes Promo', icon: Tag },
    ],
  },
  {
    collapsible: true,
    defaultOpen: false,
    title: 'Communication',
    icon: Megaphone,
    dotColor: 'bg-violet-400',
    links: [
      { href: '/admin/email-studio', label: 'Email Studio', icon: Mail },
      { href: '/admin/campaigns', label: 'Campagnes', icon: Megaphone },
      { href: '/admin/admin-social', label: 'Social Media', icon: Share2 },
      { href: '/admin/notifications-config', label: 'Config Notifications', icon: BellRing },
      { href: '/admin/briefing', label: 'Briefing', icon: BookOpen },
      { href: '/admin/landing-builder', label: 'Landing Builder', icon: HardHat },
    ],
  },
  {
    collapsible: true,
    defaultOpen: false,
    title: 'Outils Admin',
    icon: Hammer,
    dotColor: 'bg-orange-300',
    links: [
      { href: '/admin/crm', label: 'CRM', icon: Database },
      { href: '/admin/veille', label: 'Veille & Festivals', icon: Map },
      { href: '/admin/translation', label: 'Traduction', icon: Languages },
      { href: '/admin/image-bank', label: 'Banque Images', icon: Image },
      { href: '/admin/knowledge', label: 'Knowledge Base', icon: GraduationCap },
      { href: '/admin/onboarding-config', label: 'Onboarding', icon: Blocks },
      { href: '/admin/custom-agents', label: 'Agents Custom', icon: Bot },
      { href: '/admin/modules', label: 'Modules', icon: Puzzle },
    ],
  },
  {
    collapsible: true,
    defaultOpen: false,
    title: 'Mon Espace',
    icon: Building2,
    dotColor: 'bg-pink-400',
    links: [
      { href: '/admin/my-studio', label: 'Mon Studio', icon: Clapperboard },
      { href: '/admin/my-documents', label: 'Mes Documents', icon: FolderOpen },
      { href: '/admin/my-discussions', label: 'Mes Discussions', icon: MessagesSquare },
      { href: '/admin/my-strategy', label: 'Ma Stratégie', icon: Map },
      { href: '/admin/my-agents', label: 'Mes Agents', icon: Bot },
      { href: '/admin/admin-chat', label: 'Chat Admin', icon: MessageSquare },
      { href: '/admin/todo-fondateur', label: 'Todo Fondateur', icon: CheckSquare },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  const isAdminPage = pathname.startsWith('/admin')
  const userLevel = (session?.user as { level?: string })?.level
  const [mobileOpen, setMobileOpen] = useState(false)

  // Track open/closed state for each collapsible extended section
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      extendedAdminSections.map((s) => [
        s.title,
        // Auto-open if current path matches any link in the section
        false,
      ])
    )
  )

  // Auto-open the section that contains the active page
  useEffect(() => {
    const updates: Record<string, boolean> = {}
    extendedAdminSections.forEach((section) => {
      const hasActive = section.links.some((link) =>
        link.exact ? pathname === link.href : pathname.startsWith(link.href)
      )
      if (hasActive) updates[section.title] = true
    })
    if (Object.keys(updates).length > 0) {
      setOpenSections((prev) => ({ ...prev, ...updates }))
    }
  }, [pathname])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const sections = isAdminPage && isAdmin ? adminNavSections : mainNavSections

  const renderNavLink = (link: NavLink, pathname: string) => {
    const isActive = link.exact
      ? pathname === link.href
      : pathname.startsWith(link.href)
    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 group',
          isActive
            ? 'bg-[#E50914]/10 text-[#E50914] font-medium'
            : 'text-white/60 hover:text-[#E50914] hover:bg-white/[0.05]'
        )}
      >
        <link.icon className={cn(
          'h-4 w-4 shrink-0 transition-colors',
          isActive ? 'text-[#E50914]' : 'text-white/50 group-hover:text-[#E50914]'
        )} />
        <span className="flex-1">{link.label}</span>
        {link.badge && (
          <Badge className="text-[9px] px-1.5 py-0 h-4 bg-[#E50914]/15 text-[#E50914] border-[#E50914]/20">
            {link.badge}
          </Badge>
        )}
      </Link>
    )
  }

  const sidebarContent = (
    <>
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto scrollbar-thin">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 px-3 pt-1 pb-2">
              <span className={cn('w-1.5 h-1.5 rounded-full', section.dotColor)} />
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                {section.title}
              </p>
            </div>
            <div className="space-y-0.5">
              {section.links.map((link) => renderNavLink(link, pathname))}
            </div>
          </div>
        ))}

        {/* Extended collapsible admin sections */}
        {isAdminPage && isAdmin && (
          <>
            <div className="pt-1">
              <Separator className="bg-white/[0.06]" />
            </div>
            {extendedAdminSections.map((section) => {
              const isOpen = openSections[section.title] ?? false
              return (
                <div key={section.title}>
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center gap-2 px-3 pt-1 pb-2 group"
                  >
                    <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', section.dotColor)} />
                    <p className="flex-1 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50 group-hover:text-white/70 transition-colors">
                      {section.title}
                    </p>
                    {isOpen
                      ? <ChevronDown className="h-3 w-3 text-white/30 group-hover:text-white/50 transition-colors" />
                      : <ChevronRight className="h-3 w-3 text-white/30 group-hover:text-white/50 transition-colors" />
                    }
                  </button>
                  {isOpen && (
                    <div className="space-y-0.5">
                      {section.links.map((link) => renderNavLink(link, pathname))}
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </nav>

      {isAdminPage && isAdmin && (
        <div className="px-3 pb-3">
          <Separator className="mb-3 bg-white/10" />
          <div className="flex items-center gap-2 px-3 pb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <p className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.15em]">
              Utilisateur
            </p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-white/50 hover:text-[#E50914] hover:bg-white/[0.05] transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      )}

      {session?.user && (
        <div className="p-3 border-t border-white/10">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-all group"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs bg-[#E50914]/10 text-[#E50914]">
                {getInitials(session.user.name || session.user.email || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:text-[#E50914] transition-colors">
                {session.user.name || 'Utilisateur'}
              </p>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-[#E50914]/20 text-[#E50914]/70">
                  {LEVEL_LABELS_MAP[userLevel || 'ROOKIE'] || 'Rookie'}
                </Badge>
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  )

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-[72px] left-3 z-40 h-10 w-10 rounded-lg bg-[#111]/90 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors backdrop-blur-sm shadow-sm"
        aria-label="Ouvrir le menu latéral"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 z-50 w-72 h-full bg-[#0A0A0A] border-r border-white/10 flex flex-col transition-transform duration-300 shadow-xl',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-3 flex items-center justify-between border-b border-white/10">
          <span className="text-sm font-bold text-white font-[family-name:var(--font-playfair)]">CINEGENY</span>
          <button onClick={() => setMobileOpen(false)} className="h-8 w-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-white/50">
            <X className="h-4 w-4" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      <aside className="hidden lg:flex w-60 shrink-0 border-r border-white/10 bg-[#0A0A0A] min-h-[calc(100vh-64px)] flex-col">
        {sidebarContent}
      </aside>
    </>
  )
}
