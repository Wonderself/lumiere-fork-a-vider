import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Stripe Webhook Handler
 *
 * Processes Stripe events:
 * - checkout.session.completed → activate subscription
 * - invoice.payment_succeeded → renew subscription
 * - invoice.payment_failed → suspend subscription
 * - account.updated → update Connect status
 */
export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: { type: string; data: { object: Record<string, unknown> } }

  try {
    // Dynamic import that webpack cannot statically resolve
    const moduleName = 'stripe'
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Stripe = (await import(/* webpackIgnore: true */ moduleName)).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET) as typeof event
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Record<string, unknown>
        const userId = (session.metadata as Record<string, string>)?.userId
        const planId = (session.metadata as Record<string, string>)?.planId

        if (userId && planId) {
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          const plan = planId === 'premium_plus' ? 'PREMIUM_PLUS' : planId === 'premium' ? 'PREMIUM' : 'FREE'
          const stripeSubId = (session.subscription as string) || null

          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              plan: plan as 'FREE' | 'PREMIUM' | 'PREMIUM_PLUS',
              status: 'active',
              stripeSubId,
              startedAt: new Date(),
              expiresAt,
              monthlyFilmLimit: plan === 'PREMIUM_PLUS' ? -1 : plan === 'PREMIUM' ? 30 : 10,
              monthlyShortsLimit: plan === 'PREMIUM_PLUS' ? -1 : plan === 'PREMIUM' ? 50 : 20,
              hasAds: plan === 'FREE',
            },
            update: {
              plan: plan as 'FREE' | 'PREMIUM' | 'PREMIUM_PLUS',
              status: 'active',
              stripeSubId,
              expiresAt,
              monthlyFilmLimit: plan === 'PREMIUM_PLUS' ? -1 : plan === 'PREMIUM' ? 30 : 10,
              monthlyShortsLimit: plan === 'PREMIUM_PLUS' ? -1 : plan === 'PREMIUM' ? 50 : 20,
              hasAds: plan === 'FREE',
              filmsWatchedThisMonth: 0,
              shortsWatchedThisMonth: 0,
            },
          })
          console.log(`[Stripe] Subscription activated: ${plan} for user ${userId}`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Record<string, unknown>
        const subscriptionId = (invoice.subscription as string) || (invoice.customer as string)
        if (subscriptionId) {
          // Find subscription by stripeSubId (subscription ID or customer ID)
          const sub = await prisma.subscription.findFirst({
            where: { stripeSubId: subscriptionId },
          })
          if (sub) {
            await prisma.subscription.update({
              where: { id: sub.id },
              data: {
                status: 'active',
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                filmsWatchedThisMonth: 0,
                shortsWatchedThisMonth: 0,
              },
            })
          }
          console.log(`[Stripe] Invoice paid for subscription ${subscriptionId}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Record<string, unknown>
        const failedSubId = (invoice.subscription as string) || (invoice.customer as string)
        console.warn(`[Stripe] Payment failed for subscription ${failedSubId}`)
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubId: failedSubId },
        })
        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: 'past_due' },
          })
        }
        break
      }

      case 'account.updated': {
        const account = event.data.object as Record<string, unknown>
        const userId = (account.metadata as Record<string, string>)?.userId
        if (userId) {
          const chargesEnabled = account.charges_enabled as boolean
          if (process.env.NODE_ENV !== "production") console.log(`[Stripe Connect] Account ${account.id} — charges_enabled: ${chargesEnabled}`)
        }
        break
      }

      default:
        if (process.env.NODE_ENV !== "production") console.log(`[Stripe Webhook] Unhandled event: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[Stripe Webhook] Processing error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
