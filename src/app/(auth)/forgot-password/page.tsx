import type { Metadata } from 'next'
import { ForgotPasswordForm } from './forgot-password-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Forgot password — CINEGENY',
  description: 'Reset your CINEGENY password.',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
