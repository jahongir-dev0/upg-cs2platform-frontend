import { Header } from './header'
import { Footer } from './footer'
import { AuthModals } from './auth-modals'

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthModals />
    </div>
  )
}
