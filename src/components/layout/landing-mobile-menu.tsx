'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Film, Play, Star, Trophy, LogIn, UserPlus } from 'lucide-react'

const links = [
  { label: 'Films', href: '/films', icon: Film },
  { label: 'Streaming', href: '#streaming', icon: Play },
  { label: 'Tâches', href: '/tasks', icon: Star },
  { label: 'Classement', href: '/leaderboard', icon: Trophy },
]

export function LandingMobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-white/50 hover:text-white p-2 rounded-md hover:bg-white/5 transition-colors"
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-14 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl">
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/[0.06] my-2" />
              <div className="flex gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm text-white/50 border border-white/10 hover:bg-white/5 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-white bg-[#E50914] hover:opacity-90 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  S&apos;inscrire
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
