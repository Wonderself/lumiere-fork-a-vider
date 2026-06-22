'use server'

/**
 * Stripe Integration — Payments & Subscriptions
 *
 * Handles:
 * - Subscription checkout (Free → Basic → Premium)
 * - One-time payments for co-production tokens
 * - Contributor payouts via Stripe Connect
 * - Auto-payment generation on task validation
 *
 * Graceful degradation: works without Stripe keys (logs in dev).
 */

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ─── Configuration ──────────────────────────────────────────

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cinegen.studio'

type StripeMode = 'live' | 'test' | 'disabled'

function getStripeMode(): StripeMode {
  if (!STRIPE_SECRET) return 'disabled'
  return STRIPE_SECRET.startsWith('sk_live_') ? 'live' : 'test'
}

// ─── Lazy Stripe SDK loader ────────────────────────────────

async function getStripe() {
  if (!STRIPE_SECRET) return null
  try {
    const { default: Stripe } = await import('stripe')
    return new Stripe(STRIPE_SECRET, { apiVersion: '2026-02-25.clover' })
  } catch {
    console.warn('[Stripe] SDK not installed — running in mock mode')
    return null
  }
}

// ─── Subscription Plans ────────────────────────────────────

export const STRIPE_PLANS = {
  free: {
    id: 'free',
    name: 'Gratuit',
    priceMonthly: 0,
    stripePriceId: null,
    features: ['720p streaming', '1 écran', 'Publicités'],
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    priceMonthly: 499, // in cents
    stripePriceId: process.env.STRIPE_PRICE_BASIC || null,
    features: ['1080p streaming', '2 écrans', 'Sans publicité', '5 films hors-ligne'],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 999, // in cents
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM || null,
    features: ['4K HDR streaming', '4 écrans', 'Sans publicité', 'Téléchargements illimités', 'Badge Premium'],
  },
} as const

// ─── Checkout Session ──────────────────────────────────────

/**
 * Create a Stripe Checkout session for subscription.
 * Redirects user to Stripe-hosted payment page.
 */
export async function createCheckoutSessionAction(planId: 'basic' | 'premium') {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const plan = STRIPE_PLANS[planId]
  if (!plan) return { error: 'Plan invalide' }

  const stripe = await getStripe()

  if (!stripe || !plan.stripePriceId) {
    // Mock mode: directly activate plan
    if (process.env.NODE_ENV !== "production") console.log(`[Stripe Mock] Checkout for ${planId} — user ${session.user.id}`)

    // Update user subscription in DB
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        bio: `subscription:${planId}:${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()}`,
      },
    })

    return {
      data: {
        url: `${APP_URL}/dashboard?subscription=success&plan=${planId}`,
        mock: true,
      },
    }
  }

  // Real Stripe checkout
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    success_url: `${APP_URL}/dashboard?subscription=success&plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/pricing?cancelled=true`,
    customer_email: session.user.email || undefined,
    metadata: {
      userId: session.user.id,
      planId,
    },
    allow_promotion_codes: true,
  })

  return { data: { url: checkoutSession.url, mock: false } }
}

// ─── Contributor Payout ────────────────────────────────────

/**
 * Create a payout to a contributor via Stripe Connect.
 * Called after task validation + payment approval.
 */
export async function createPayoutAction(paymentId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  // Verify admin
  const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (admin?.role !== 'ADMIN') return { error: 'Accès refusé' }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { user: { select: { id: true, email: true, displayName: true, walletAddress: true } } },
  })
  if (!payment) return { error: 'Paiement introuvable' }
  if (payment.status === 'COMPLETED') return { error: 'Paiement déjà effectué' }

  const stripe = await getStripe()

  if (!stripe) {
    // Mock mode: mark payment as completed
    if (process.env.NODE_ENV !== "production") console.log(`[Stripe Mock] Payout ${payment.amountEur}€ to ${payment.user.email}`)

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'COMPLETED', paidAt: new Date(), method: 'STRIPE' as never },
    })

    return {
      data: {
        paymentId,
        amount: payment.amountEur,
        recipient: payment.user.email,
        mock: true,
        message: `Paiement de ${payment.amountEur}€ marqué comme complété (mode mock).`,
      },
    }
  }

  // Real Stripe Connect payout
  // Requires the contributor to have a connected Stripe account
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(payment.amountEur * 100), // cents
      currency: 'eur',
      destination: payment.user.walletAddress || '', // Stripe Connect account ID
      metadata: {
        paymentId: payment.id,
        userId: payment.user.id,
        taskId: payment.taskId,
      },
    })

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
        method: 'STRIPE' as never,
        txHash: transfer.id,
      },
    })

    return {
      data: {
        paymentId,
        transferId: transfer.id,
        amount: payment.amountEur,
        mock: false,
      },
    }
  } catch (err) {
    console.error('[Stripe] Transfer failed:', err)
    return { error: 'Échec du transfert Stripe' }
  }
}

// ─── Auto-Payment on Task Validation ───────────────────────

/**
 * Automatically generate payment when a task is validated.
 * Called from approveSubmissionAction in admin.ts.
 */
export async function generateAutoPayment(
  taskId: string,
  userId: string,
  amountEur: number,
  _filmId: string
) {
  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      userId,
      taskId,
      amountEur,
      status: 'PENDING',
      method: 'LUMEN',
    } as never,
  })

  // If Stripe is configured, attempt auto-payout
  const stripe = await getStripe()
  if (stripe) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletAddress: true },
    })

    // Only auto-payout if user has Stripe Connect set up
    if (user?.walletAddress?.startsWith('acct_')) {
      try {
        const transfer = await stripe.transfers.create({
          amount: Math.round(amountEur * 100),
          currency: 'eur',
          destination: user.walletAddress,
          metadata: { paymentId: payment.id, taskId },
        })

        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'COMPLETED',
            paidAt: new Date(),
            method: 'STRIPE' as never,
            txHash: transfer.id,
          },
        })

        return { paymentId: payment.id, transferId: transfer.id, autoPaid: true }
      } catch (err) {
        console.error('[Stripe Auto-Payment] Transfer failed:', err)
        // Payment stays PENDING for manual processing
      }
    }
  }

  return { paymentId: payment.id, autoPaid: false }
}

// ─── Stripe Connect Onboarding ─────────────────────────────

/**
 * Create a Stripe Connect onboarding link for a contributor.
 * The contributor completes KYC on Stripe's hosted page.
 */
export async function createConnectOnboardingAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const stripe = await getStripe()
  if (!stripe) {
    return {
      data: {
        url: `${APP_URL}/dashboard?stripe=mock`,
        mock: true,
        message: 'Stripe Connect n\'est pas configuré. Mode démonstration.',
      },
    }
  }

  // Check if user already has a connected account
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { walletAddress: true, email: true },
  })

  let accountId = user?.walletAddress

  // Create new connected account if needed
  if (!accountId || !accountId.startsWith('acct_')) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: user?.email || undefined,
      capabilities: {
        transfers: { requested: true },
      },
      metadata: { userId: session.user.id },
    })
    accountId = account.id

    // Save the Stripe account ID
    await prisma.user.update({
      where: { id: session.user.id },
      data: { walletAddress: accountId },
    })
  }

  // Generate onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${APP_URL}/dashboard/earnings?stripe=refresh`,
    return_url: `${APP_URL}/dashboard/earnings?stripe=connected`,
    type: 'account_onboarding',
  })

  return { data: { url: accountLink.url, mock: false } }
}

// ─── Stripe Status ─────────────────────────────────────────

/**
 * Get current Stripe integration status.
 */
export async function getStripeStatusAction() {
  const mode = getStripeMode()
  const session = await auth()

  let userConnected = false
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { walletAddress: true },
    })
    userConnected = !!user?.walletAddress?.startsWith('acct_')
  }

  return {
    data: {
      mode,
      configured: mode !== 'disabled',
      userConnected,
      webhookConfigured: !!STRIPE_WEBHOOK_SECRET,
    },
  }
}
