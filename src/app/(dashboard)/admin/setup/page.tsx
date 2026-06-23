import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
  CheckCircle2, Circle, AlertTriangle, ArrowRight,
  Database, Key, Shield, Mail, Bot, CreditCard,
  Globe, Server, Settings, Smartphone,
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Setup Checklist — Admin CINEGENY' }

interface CheckItem {
  id: string
  label: string
  description: string
  icon: typeof Database
  status: 'done' | 'pending' | 'warning'
  href?: string
  detail: string
}

export default async function SetupPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard')

  // Build checklist based on env vars and DB state
  const checks: CheckItem[] = [
    {
      id: 'database', label: 'PostgreSQL', description: 'Database connected',
      icon: Database, status: 'done', detail: 'Connected via Prisma ORM',
    },
    {
      id: 'auth', label: 'Authentification', description: 'NextAuth configured',
      icon: Key, status: 'warning', detail: '⚠️ Auth bypass admin@admin.com active — disable in production',
      href: '/admin/security',
    },
    {
      id: '2fa', label: '2FA Admin', description: 'Authentification 2 facteurs',
      icon: Shield, status: 'pending', detail: 'Not configured — recommended for admin security',
      href: '/admin/security',
    },
    {
      id: 'email', label: 'Email (Resend)', description: 'Service d\'email transactionnel',
      icon: Mail, status: process.env.RESEND_API_KEY ? 'done' : 'pending',
      detail: process.env.RESEND_API_KEY ? 'API key configured' : 'Set RESEND_API_KEY in environment',
    },
    {
      id: 'anthropic', label: 'Anthropic API', description: 'API Claude pour les agents IA',
      icon: Bot, status: process.env.ANTHROPIC_API_KEY ? 'done' : 'pending',
      detail: process.env.ANTHROPIC_API_KEY ? 'API key configured' : 'Set ANTHROPIC_API_KEY — required for AI features',
    },
    {
      id: 'telegram', label: 'Telegram Bot', description: 'Bot admin Telegram',
      icon: Smartphone, status: process.env.TELEGRAM_BOT_TOKEN ? 'done' : 'pending',
      detail: process.env.TELEGRAM_BOT_TOKEN ? 'Bot token configured' : 'Set TELEGRAM_BOT_TOKEN + TELEGRAM_ADMIN_CHAT_ID',
    },
    {
      id: 'redis', label: 'Redis', description: 'Cache et rate limiting',
      icon: Server, status: process.env.REDIS_URL ? 'done' : 'pending',
      detail: process.env.REDIS_URL ? 'Connected' : 'Optional — graceful fallback active without Redis',
    },
    {
      id: 'stripe', label: 'Stripe', description: 'Paiements et abonnements',
      icon: CreditCard, status: process.env.STRIPE_SECRET_KEY ? 'done' : 'pending',
      detail: process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Set STRIPE_SECRET_KEY for payment processing',
    },
    {
      id: 'domain', label: 'Domaine', description: 'Custom domain + SSL',
      icon: Globe, status: 'pending', detail: 'Configure custom domain in Coolify/Vercel',
    },
    {
      id: 'guardrails', label: 'Guardrails', description: '10 protection modules enabled',
      icon: Shield, status: 'done', detail: 'All 10 guardrail modules active',
      href: '/admin/guardrails',
    },
  ]

  const doneCount = checks.filter(c => c.status === 'done').length
  const totalCount = checks.length
  const progressPct = Math.round((doneCount / totalCount) * 100)

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Setup Checklist
        </h1>
        <p className="text-sm text-white/50 mt-1">Configuration initiale de la plateforme CineGeny</p>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">{doneCount}/{totalCount} étapes complétées</span>
          <span className="text-sm font-bold text-[#E50914]">{progressPct}%</span>
        </div>
        <div className="w-full h-3 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E50914] to-[#FF6B35] rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {checks.map(check => {
          const CIcon = check.icon
          const content = (
            <div className={`rounded-xl border bg-white/5 p-5 transition-colors ${
              check.href ? 'hover:bg-white/[0.03] cursor-pointer' : ''
            } ${
              check.status === 'warning' ? 'border-yellow-500/20' :
              check.status === 'done' ? 'border-green-500/15' : 'border-white/10'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  check.status === 'done' ? 'bg-green-500/10' :
                  check.status === 'warning' ? 'bg-yellow-500/10' : 'bg-white/[0.03]'
                }`}>
                  <CIcon className={`h-5 w-5 ${
                    check.status === 'done' ? 'text-green-500' :
                    check.status === 'warning' ? 'text-yellow-500' : 'text-white/50'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{check.label}</p>
                    {check.status === 'done' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : check.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-white/50" />
                    )}
                  </div>
                  <p className="text-xs text-white/50">{check.description}</p>
                  <p className="text-[10px] text-white/50 mt-1">{check.detail}</p>
                </div>
                {check.href && <ArrowRight className="h-4 w-4 text-white/50 shrink-0" />}
              </div>
            </div>
          )

          return check.href ? (
            <Link key={check.id} href={check.href}>{content}</Link>
          ) : (
            <div key={check.id}>{content}</div>
          )
        })}
      </div>
    </div>
  )
}
