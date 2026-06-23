import { redirect } from 'next/navigation'

// Merged into the single pricing page.
export default function ApiPricingRedirect() {
  redirect('/pricing')
}
