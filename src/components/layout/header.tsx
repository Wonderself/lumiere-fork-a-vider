'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
  Film,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Star,
  User,
  X,
  Trophy,
  BookOpen,
  CreditCard,
  Sun,
  FileText,
  ChevronDown,
  Info,
  Play,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { AnimatePresence, MotionDiv } from '@/components/ui/motion'
import { NotificationBell } from '@/components/layout/notification-bell'

const navLinks = [
  { href: '/films', label: 'Films', icon: Film },
  { href: '/streaming', label: 'Streaming', icon: Play },
  { href: '/tasks', label: 'Tâches', icon: Star, protected: true },
  { href: '/leaderboard', label: 'Classement', icon: Trophy },
  { href: '/about', label: 'À Propos', icon: Info },
  { href: '/roadmap', label: 'Roadmap', icon: BookOpen },
]

export function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'
  const userName = session?.user?.name || session?.user?.email || ''

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/20 bg-[#0A0A0A]/80 backdrop-blur-2xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <Image
            src="/images/cinegen-logo.svg"
            alt="CINEGENY Studio"
            width={140}
            height={40}
            className="h-8 w-auto object-contain group-hover:brightness-110 transition-all duration-300"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            if (link.protected && !session?.user) return null
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive ? 'text-[#E50914]' : 'text-white/50 hover:text-white/80'
                )}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
                {isActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#E50914] rounded-full" />}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                'relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname.startsWith('/admin') ? 'text-[#E50914]' : 'text-white/50 hover:text-white/80'
              )}
            >
              <Settings className="h-3.5 w-3.5" />
              Admin
              {pathname.startsWith('/admin') && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#E50914] rounded-full" />}
            </Link>
          )}
        </nav>

        {/* Right section */}
        <div className="hidden lg:flex items-center gap-2">
          {session?.user ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Link href="/lumens" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/50 hover:text-[#E50914] hover:bg-[#E50914]/5 transition-all">
                <Sun className="h-4 w-4 text-[#E50914]" />
                <span className="font-medium">0</span>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/5 transition-all outline-none" aria-label="Menu du profil">
                    <Avatar className="h-8 w-8">
                      {session.user.image && <AvatarImage src={session.user.image} alt={userName} />}
                      <AvatarFallback className="text-xs">{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-white/30" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-white/40">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" /> Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/payments" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" /> Paiements
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lumens" className="flex items-center gap-2 cursor-pointer">
                      <Sun className="h-4 w-4" /> Mes Lumens
                    </Link>
                  </DropdownMenuItem>
                  {(session.user as { role?: string }).role === 'SCREENWRITER' && (
                    <DropdownMenuItem asChild>
                      <Link href="/screenplays" className="flex items-center gap-2 cursor-pointer">
                        <FileText className="h-4 w-4" /> Mes Scénarios
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" /> Administration
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                    onClick={async () => { await signOut({ redirect: false }); window.location.href = '/' }}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login"><Button variant="ghost" size="sm">Se connecter</Button></Link>
              <Link href="/register"><Button size="sm">Rejoindre</Button></Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-white/5 bg-[#0A0A0A]/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                if (link.protected && !session?.user) return null
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                      pathname.startsWith(link.href) ? 'text-[#E50914] bg-[#E50914]/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )
              })}
              {session?.user ? (
                <>
                  <div className="h-px bg-white/5 my-2" />
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <User className="h-4 w-4" /> Profil
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <Settings className="h-4 w-4" /> Admin
                    </Link>
                  )}
                  <div className="h-px bg-white/5 my-2" />
                  <button
                    onClick={async () => { await signOut({ redirect: false }); window.location.href = '/' }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-lg w-full transition-all"
                  >
                    <LogOut className="h-4 w-4" /> Se déconnecter
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-3">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Se connecter</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button size="sm" className="w-full">Rejoindre</Button>
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
