import { redirect } from 'next/navigation'

// Merged into the single "My activity" page.
export default function TimelineRedirect() {
  redirect('/dashboard/activity')
}
