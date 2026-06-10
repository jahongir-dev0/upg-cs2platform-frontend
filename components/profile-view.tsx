'use client'

import { useEffect, useState } from 'react'
import { Crown, ExternalLink } from 'lucide-react'
import { useAuth } from './providers'
import { SteamLoginButton } from './steam-login-button'
import { api } from '@/lib/api'
import type { Order } from '@/lib/types'
import { OrdersTable } from './orders-table'

function formatPrice(n: number) {
  return new Intl.NumberFormat('uz-UZ').format(n)
}

export function ProfileView() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let active = true
    api.getOrders()
      .then((data) => { if (active) setOrders(data) })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [user])

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground">
          Kirish talab qilinadi
        </h1>
        <p className="mt-3 text-muted-foreground">
          Profilingizni ko&apos;rish uchun Steam orqali kiring.
        </p>
        <div className="mt-6 flex justify-center">
          <SteamLoginButton size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 py-8">
      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-28 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
        <div className="flex flex-col items-center gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <img
            src={user.avatar || '/placeholder-user.jpg'}
            alt={user.username}
            className="-mt-12 h-24 w-24 rounded-xl border-4 border-card object-cover"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground">
                {user.username}
              </h1>
              {user.is_premium && (
                <span
                  className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase"
                  style={{ background: 'rgba(255,215,0,0.12)', color: 'var(--gold)' }}
                >
                  <Crown className="h-3 w-3" /> Premium
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Ro&apos;yxatdan o&apos;tgan: {new Date(user.created_at).toLocaleDateString('uz-UZ')}
            </p>
            <div className="mt-1 flex items-center justify-center gap-3 sm:justify-start">
              <p className="font-mono text-xs text-muted-foreground">
                Steam ID: {user.steam_id || 'N/A'}
              </p>
              {user.steam_url && (
                <a
                  href={user.steam_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Steam profil <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-border-subtle bg-surface px-5 py-3 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Balans</p>
            <p className="font-heading text-2xl font-bold text-primary">
              {formatPrice(user.balance)} UZS
            </p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div>
        <h2 className="mb-4 font-heading text-xl font-bold uppercase tracking-wide text-foreground">
          Oxirgi buyurtmalar
        </h2>
        <OrdersTable orders={orders} loading={loading} />
      </div>
    </div>
  )
}
