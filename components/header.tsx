'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import { useAuth } from './providers'
import { SteamLoginButton } from './steam-login-button'
import { Logo } from './ui-bits'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'SERVERLAR', href: '/servers' },
  { label: 'LIDERLAR', href: '/leaderboard' },
  { label: "DO'KON", href: '/shop' },
  { label: 'BUYURTMALAR', href: '/orders' },
  { label: 'YORDAM', href: '/help' },
]

function formatBalance(n: number) {
  return new Intl.NumberFormat('uz-UZ').format(n)
}

export function Header() {
  const pathname = usePathname()
  const { user, loading, steamLogin, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(14px)',
        borderColor: 'rgba(233,30,140,0.2)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        <Link href="/" className="shrink-0">
          <Logo size="md" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {loading ? (
            <div className="h-9 w-24 animate-skeleton rounded-lg bg-surface" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface py-1.5 pl-1.5 pr-3 transition-colors hover:border-primary/40"
              >
                <img
                  src={user.avatar || '/placeholder-user.jpg'}
                  alt={user.username}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-primary/60"
                />
                <div className="hidden flex-col leading-tight sm:flex">
                  <span className="flex items-center gap-1.5 text-xs font-semibold">
                    {user.username}
                    {user.is_premium && (
                      <span className="rounded bg-primary/20 px-1 text-[10px] font-bold uppercase text-primary">
                        PRO
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatBalance(user.balance)} UZS
                  </span>
                </div>
              </Link>
              <button
                onClick={logout}
                aria-label="Chiqish"
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:block">
              <SteamLoginButton size="sm" />
            </div>
          )}

          <button
            aria-label="Menyu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border-subtle bg-card px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {!user && !loading && (
            <div className="mt-3">
              <SteamLoginButton size="md" className="w-full" />
            </div>
          )}
        </div>
      )}
    </header>
  )
}
