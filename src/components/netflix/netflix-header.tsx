'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Sun,
  CreditCard,
  FileText,
  ChevronDown,
  Sparkles,
  Info,
  MapPin,
  Tag,
  Code2,
  TrendingUp,
  Users,
  Film,
  Clapperboard,
  DollarSign,
  MessageSquare,
  Trophy,
  UserCircle,
  Star,
  Briefcase,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { AnimatePresence, MotionDiv } from '@/components/ui/motion'
import { NotificationBell } from '@/components/layout/notification-bell'
import { SearchOverlay } from '@/components/search-overlay'
import { LocaleSwitcher } from '@/components/layout/locale-switcher'

/* ── Dropdown item component ── */
function NavDropdown({
  label,
  items,
  isActive,
}: {
  label: string
  items: { href: string; label: string; icon: React.ElementType }[]
  isActive: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className={cn(
          'flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded transition-all duration-300',
          isActive
            ? 'text-white/90'
            : 'text-white/40 hover:text-white/80'
        )}
      >
        {label}
        <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <MotionDiv
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            onMouseLeave={() => setOpen(false)}
            className="absolute top-full left-0 mt-1 min-w-[200px] bg-[#111]/98 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                <item.icon className="h-3.5 w-3.5 text-white/30" />
                {item.label}
              </Link>
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  )
}

export function NetflixHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations('nav')

  const isAdmin = session?.user?.role === 'ADMIN'
  const userName = session?.user?.name || session?.user?.email || ''

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Menu structure ── */
  const createItems = [
    { href: '/create', label: 'Start a Film', icon: Clapperboard },
    { href: '/act', label: 'Act In Your Movie', icon: Star },
    { href: '/community/scenarios/new', label: 'Submit a Scenario', icon: FileText },
  ]

  const exploreItems = [
    { href: '/films', label: t('films'), icon: Film },
    { href: '/actors', label: t('actors'), icon: UserCircle },
    { href: '/trailer-studio', label: 'Trailer Studio', icon: Sparkles },
    { href: '/leaderboard', label: t('leaderboard'), icon: Trophy },
  ]

  const mobileLinks = [
    { href: '/', label: t('home'), icon: Film },
    { href: '/films', label: t('films'), icon: Clapperboard },
    { href: '/act', label: 'Act', icon: Star },
    { href: '/produce', label: 'Produce', icon: Clapperboard },
    { href: '/work', label: 'Work', icon: Users },
    { href: '/invest', label: t('invest'), icon: DollarSign },
    { href: '/investors', label: 'Investors', icon: TrendingUp },
    { href: '/community', label: t('community'), icon: MessageSquare },
  ]

  const moreItems = [
    { href: '/act', label: 'Act', icon: Star },
    { href: '/produce', label: 'Produce', icon: Clapperboard },
    { href: '/work', label: 'Work', icon: Briefcase },
  ]

  const isCreateActive = pathname.startsWith('/create') || pathname.startsWith('/act')
  const isExploreActive = pathname.startsWith('/films') || pathname.startsWith('/actors') || pathname.startsWith('/trailer-studio') || pathname.startsWith('/leaderboard')
  const isMoreActive = pathname.startsWith('/act') || pathname.startsWith('/produce') || pathname.startsWith('/work')

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[#0A0A0A]/95 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.5)]'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
      )}
    >
      <div className="flex h-14 md:h-[56px] items-center justify-between px-5 md:px-10 lg:px-16 mt-1">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center shrink-0 group relative">
          <div
            className="absolute -inset-3 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: 'radial-gradient(ellipse, rgba(229,9,20,0.08) 0%, transparent 70%)' }}
          />
          <span className="relative text-xl md:text-2xl font-black tracking-[0.15em] text-white group-hover:tracking-[0.2em] transition-all duration-500">
            CINE<span
              className="text-[#E50914] relative"
              style={{ animation: 'logoGlowPulse 4s ease-in-out infinite' }}
            >GENY</span>
          </span>
          <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] overflow-hidden">
            <div
              className="h-full w-0 group-hover:w-full transition-all duration-700 ease-out"
              style={{ background: 'linear-gradient(90deg, transparent, #E50914, #FF2D2D, #E50914, transparent)' }}
            />
          </div>
        </Link>

        {/* Center: Desktop nav with dropdowns */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/films"
            className={cn(
              'text-[11px] px-2.5 py-1.5 rounded transition-all duration-300',
              pathname.startsWith('/films') ? 'text-white/90' : 'text-white/40 hover:text-white/80'
            )}
          >
            {t('films')}
          </Link>
          <Link
            href="/invest"
            className={cn(
              'text-[11px] px-2.5 py-1.5 rounded transition-all duration-300',
              pathname.startsWith('/invest') ? 'text-white/90' : 'text-white/40 hover:text-white/80'
            )}
          >
            {t('invest')}
          </Link>
          <Link
            href="/investors"
            className={cn(
              'flex items-center gap-1 text-[11px] px-2.5 py-1.5 rounded transition-all duration-300 font-semibold',
              pathname.startsWith('/investors')
                ? 'text-amber-400'
                : 'text-amber-400/70 hover:text-amber-400'
            )}
          >
            <TrendingUp className="h-3 w-3" />
            Investors
            <span className="ml-0.5 px-1 py-0 text-[9px] font-bold rounded bg-amber-400/15 text-amber-400 border border-amber-400/25">OPEN</span>
          </Link>
          <Link
            href="/community"
            className={cn(
              'text-[11px] px-2.5 py-1.5 rounded transition-all duration-300',
              pathname.startsWith('/community') ? 'text-white/90' : 'text-white/40 hover:text-white/80'
            )}
          >
            {t('community')}
          </Link>
          <NavDropdown label={t('create')} items={createItems} isActive={isCreateActive} />
          <NavDropdown label={t('explore')} items={exploreItems} isActive={isExploreActive} />
          <NavDropdown label={t('more')} items={moreItems} isActive={isMoreActive} />
        </nav>

        {/* Right: Search + Lang + Profile + Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <SearchOverlay />
          <LocaleSwitcher />

          {session?.user ? (
            <div className="hidden lg:flex items-center gap-1.5">
              <NotificationBell />
              <Link href="/lumens" className="flex items-center gap-1.5 px-2 py-1 rounded text-sm text-white/50 hover:text-[#E50914] transition-all" aria-label="My Lumens">
                <Sun className="h-3.5 w-3.5 text-[#E50914]" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded px-1 py-1 hover:bg-white/5 transition-all outline-none" aria-label="Profile menu">
                    <Avatar className="h-7 w-7 rounded">
                      {session.user.image && <AvatarImage src={session.user.image} alt={userName} />}
                      <AvatarFallback className="text-[10px] rounded bg-[#E50914]/20 text-[#E50914]">{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-white/30" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#111] border-white/10">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-white/40">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <LayoutDashboard className="h-4 w-4" /> {t('dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <User className="h-4 w-4" /> {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/payments" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <CreditCard className="h-4 w-4" /> {t('payments')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lumens" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <Sun className="h-4 w-4" /> {t('lumens')}
                    </Link>
                  </DropdownMenuItem>
                  {(session.user as { role?: string }).role === 'SCREENWRITER' && (
                    <DropdownMenuItem asChild>
                      <Link href="/screenplays" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                        <FileText className="h-4 w-4" /> Screenplays
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                          <Settings className="h-4 w-4" /> Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                    onClick={async () => { await signOut({ redirect: false }); window.location.href = '/' }}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> {t('sign_out')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/login"
                className="text-[12px] font-medium text-white/60 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300"
              >
                {t('sign_in')}
              </Link>
              <Link
                href="/register"
                className="relative text-[12px] font-bold px-5 py-2 rounded-lg text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,9,20,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #E50914 0%, #B20710 100%)' }}
              >
                <span className="relative z-10">{t('sign_up')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700" />
              </Link>
            </div>
          )}

          {/* Hamburger — visible on mobile + tablet (below lg) */}
          <button
            className="lg:hidden text-white/60 hover:text-white p-1.5 rounded transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#0A0A0A]/98 backdrop-blur-xl overflow-hidden border-t border-white/5"
          >
            <div className="px-5 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href))
                      ? 'text-[#E50914] bg-[#E50914]/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-white/5 my-2" />
              {session?.user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <LayoutDashboard className="h-4 w-4" /> {t('dashboard')}
                  </Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <User className="h-4 w-4" /> {t('profile')}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <Settings className="h-4 w-4" /> {t('admin')}
                    </Link>
                  )}
                  <button
                    onClick={async () => { await signOut({ redirect: false }); window.location.href = '/' }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-lg w-full transition-all"
                  >
                    <LogOut className="h-4 w-4" /> {t('sign_out')}
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm text-white/60 border border-white/10 rounded-full py-2.5 hover:bg-white/5 transition-all">
                    {t('sign_in')}
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-semibold text-white rounded-full py-2.5" style={{ background: 'linear-gradient(135deg, #E50914, #B20710)' }}>
                    {t('sign_up')}
                  </Link>
                </div>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  )
}
