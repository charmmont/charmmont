import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AuthHashRedirect from '@/components/AuthHashRedirect'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthHashRedirect />
      <Navigation />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </>
  )
}
