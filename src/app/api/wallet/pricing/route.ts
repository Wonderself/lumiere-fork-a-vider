import { getAllPricing } from '@/lib/ai-pricing'
import { NextResponse } from 'next/server'

/** GET /api/wallet/pricing — Get transparent pricing table (public) */
export async function GET() {
  const pricing = getAllPricing()
  return NextResponse.json(pricing)
}
