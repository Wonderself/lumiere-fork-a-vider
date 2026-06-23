import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { KycButton } from './kyc-button'
import { ShieldCheck, Clock, XCircle, ArrowLeft, Lock } from 'lucide-react'

export const metadata: Metadata = { title: 'Identity verification — CINEGENY' }

export default async function KycPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard/kyc')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { kycStatus: true },
  })
  const status = user?.kycStatus ?? 'NONE'

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 text-white">
      <Link href="/lumens" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Lumens
      </Link>

      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E50914]/10 border border-[#E50914]/20 mb-5">
        <ShieldCheck className="h-7 w-7 text-[#E50914]" />
      </div>
      <h1 className="text-3xl font-bold font-playfair">Identity verification</h1>
      <p className="mt-3 text-white/55 leading-relaxed">
        To convert Lumens into real money, we verify your identity once — this is a legal
        requirement that keeps the platform secure for everyone. After that, every withdrawal is
        smooth and instant to request.
      </p>

      <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
        {status === 'VERIFIED' ? (
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-green-400 shrink-0" />
            <div>
              <p className="font-semibold text-green-400">Your identity is verified</p>
              <p className="text-sm text-white/50 mt-1">
                You can now withdraw your Lumens to your bank account from the Lumens page.
              </p>
              <Link
                href="/lumens"
                className="mt-4 inline-flex items-center h-10 px-4 rounded-lg bg-[#E50914] hover:bg-[#FF2D2D] text-sm font-semibold transition-colors"
              >
                Go to withdrawals
              </Link>
            </div>
          </div>
        ) : status === 'PENDING' ? (
          <div className="flex items-start gap-3">
            <Clock className="h-6 w-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-amber-400">Verification in progress</p>
              <p className="text-sm text-white/50 mt-1">
                We&apos;re reviewing your details. You&apos;ll be notified as soon as it&apos;s approved.
              </p>
            </div>
          </div>
        ) : status === 'REJECTED' ? (
          <div className="flex items-start gap-3">
            <XCircle className="h-6 w-6 text-red-400 shrink-0" />
            <div>
              <p className="font-semibold text-red-400">Verification could not be completed</p>
              <p className="text-sm text-white/50 mt-1 mb-4">Please try again with valid details.</p>
              <KycButton />
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <Lock className="h-6 w-6 text-white/40 shrink-0" />
            <div>
              <p className="font-semibold text-white/90">Not verified yet</p>
              <p className="text-sm text-white/50 mt-1 mb-4">
                Start the one-time check to unlock withdrawals. It only takes a moment.
              </p>
              <KycButton />
              <p className="mt-3 text-xs text-white/30">
                A secure identity provider (e.g. Stripe Identity) is used to verify you. Until it&apos;s
                configured, verification is approved in simulated mode for testing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
