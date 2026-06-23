import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

/**
 * Server-side guard for the entire /admin area.
 * Runs before any admin page (including client components that cannot
 * check the session themselves), so non-admins are redirected away
 * regardless of which admin route they hit directly.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }
  return <>{children}</>
}
