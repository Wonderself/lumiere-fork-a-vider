'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sun } from 'lucide-react'

export function LumensCounter() {
  const [lumens, setLumens] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/user/lumens')
      .then((res) => res.json())
      .then((data) => setLumens(data.lumens ?? 0))
      .catch(() => setLumens(0))
  }, [])

  return (
    <Link
      href="/lumens"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-[#E50914] hover:bg-amber-50 transition-all"
    >
      <Sun className="h-4 w-4 text-[#E50914]" />
      <span className="font-medium">
        {lumens === null ? (
          <span className="inline-block w-6 h-4 rounded bg-gray-100 animate-pulse" />
        ) : (
          lumens.toLocaleString('fr-FR')
        )}
      </span>
    </Link>
  )
}
