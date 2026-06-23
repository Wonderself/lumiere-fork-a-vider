import { redirect } from 'next/navigation'

// Duplicate landing page — merged into the main home (/).
export default function HomeRedirect() {
  redirect('/')
}
