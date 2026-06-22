import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatPrice(euros: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(euros)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function getProgressColor(progress: number): string {
  if (progress >= 100) return 'bg-green-500'
  if (progress >= 75) return 'bg-blue-500'
  if (progress >= 50) return 'bg-yellow-500'
  if (progress >= 25) return 'bg-orange-500'
  return 'bg-red-500'
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getLevelColor(level: string): string {
  switch (level) {
    case 'ROOKIE':
      return 'text-gray-400'
    case 'PRO':
      return 'text-blue-400'
    case 'EXPERT':
      return 'text-purple-400'
    case 'VIP':
      return 'text-yellow-400'
    default:
      return 'text-gray-400'
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'EASY':
      return 'text-green-400'
    case 'MEDIUM':
      return 'text-yellow-400'
    case 'HARD':
      return 'text-orange-400'
    case 'EXPERT':
      return 'text-red-400'
    default:
      return 'text-gray-400'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'CLAIMED':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'SUBMITTED':
    case 'AI_REVIEW':
    case 'HUMAN_REVIEW':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'VALIDATED':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'REJECTED':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'LOCKED':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}
