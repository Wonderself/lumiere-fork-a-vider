import { redirect } from 'next/navigation'

// Merged into the single Notifications page.
export default function NotificationsCenterRedirect() {
  redirect('/notifications')
}
