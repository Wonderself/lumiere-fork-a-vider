'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  width?: 'sm' | 'md' | 'lg' | 'xl'
}

const WIDTH_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export function SlideOver({ open, onClose, title, description, children, width = 'md' }: SlideOverProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 flex">
        <div
          ref={panelRef}
          className={`w-screen ${WIDTH_MAP[width]} bg-[#111] shadow-2xl transform transition-transform duration-300 ease-out`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              {description && <p className="text-xs text-white/50 mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-white/50" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto h-[calc(100vh-80px)] px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
