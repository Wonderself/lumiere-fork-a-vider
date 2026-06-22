'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Film, User, Sparkles, Loader2 } from 'lucide-react'
import { searchAction } from '@/app/actions/search'
import { cn } from '@/lib/utils'

type SearchResults = Awaited<ReturnType<typeof searchAction>>

export function SearchOverlay() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>({ films: [], users: [], tasks: [] })
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults({ films: [], users: [], tasks: [] })
    }
  }, [open])

  // Keyboard shortcut: Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Search on input
  useEffect(() => {
    if (query.length < 2) {
      setResults({ films: [], users: [], tasks: [] })
      return
    }
    const timer = setTimeout(() => {
      startTransition(async () => {
        const res = await searchAction(query)
        setResults(res)
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const navigate = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const hasResults = results.films.length > 0 || results.users.length > 0 || results.tasks.length > 0

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 h-8 px-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all text-white/40 hover:text-white/60 text-xs"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden lg:inline">Search...</span>
        <kbd className="hidden lg:inline ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/30">
          Ctrl+K
        </kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Search panel */}
      <div
        className="relative max-w-2xl mx-auto mt-[15vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden">
          {/* Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
            {isPending ? (
              <Loader2 className="h-5 w-5 text-[#E50914] animate-spin shrink-0" />
            ) : (
              <Search className="h-5 w-5 text-white/30 shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for a film, task, or creator..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none"
            />
            <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results */}
          {query.length >= 2 && (
            <div className="max-h-[60vh] overflow-y-auto">
              {!hasResults && !isPending && (
                <div className="p-8 text-center text-white/30 text-sm">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {/* Films */}
              {results.films.length > 0 && (
                <div className="p-3">
                  <p className="text-xs text-white/30 uppercase tracking-wider px-2 mb-2">Films</p>
                  {results.films.map((film) => (
                    <button
                      key={film.id}
                      onClick={() => navigate(`/films/${film.slug}`)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="h-8 w-8 rounded-lg bg-[#E50914]/10 flex items-center justify-center shrink-0">
                        <Film className="h-4 w-4 text-[#E50914]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 truncate">{film.title}</p>
                        <p className="text-xs text-white/30">{film.genre || 'Film'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div className="p-3 border-t border-white/5">
                  <p className="text-xs text-white/30 uppercase tracking-wider px-2 mb-2">Available Tasks</p>
                  {results.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 truncate">{task.title}</p>
                        <p className="text-xs text-white/30">{task.type} · {task.priceEuros}€</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Users */}
              {results.users.length > 0 && (
                <div className="p-3 border-t border-white/5">
                  <p className="text-xs text-white/30 uppercase tracking-wider px-2 mb-2">Creators</p>
                  {results.users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => navigate(`/users/${user.id}`)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs text-white/30">{user.role} · {user.level}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer hint */}
          <div className="px-4 py-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-white/20">
            <span>Type at least 2 characters</span>
            <span>Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
