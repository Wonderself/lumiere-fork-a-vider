import { redirect } from 'next/navigation'

// Merged into the single Creator space.
export default function CreatorProfileRedirect() {
  redirect('/dashboard/creator')
}
