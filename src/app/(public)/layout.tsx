import { NetflixHeader } from '@/components/netflix/netflix-header'
import { Footer } from '@/components/layout/footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NetflixHeader />
      <main className="min-h-[calc(100vh-64px)] pt-20 md:pt-[76px] pb-4">{children}</main>
      <Footer />
    </>
  )
}
