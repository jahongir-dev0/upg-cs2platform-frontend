'use client'

import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import type { Order } from '@/lib/types'
import { api } from '@/lib/api'
import { useAuth } from './providers'
import { SteamLoginButton } from './steam-login-button'

function formatPrice(n: number) {
  return new Intl.NumberFormat('uz-UZ').format(n)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Kutilmoqda',
  active: 'Faol',
  expired: 'Muddati tugagan',
  cancelled: 'Bekor qilingan',
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'rgba(255,152,0,0.12)', text: 'var(--warning)' },
  active: { bg: 'rgba(0,230,118,0.12)', text: 'var(--online)' },
  expired: { bg: 'rgba(255,23,68,0.12)', text: 'var(--offline)' },
  cancelled: { bg: 'rgba(139,139,158,0.12)', text: 'var(--muted-foreground)' },
}

interface OrdersTableProps {
  orders?: Order[]
  loading?: boolean
}

export function OrdersTable({ orders: ordersProp, loading: loadingProp }: OrdersTableProps) {
  const { user } = useAuth()
  const controlled = ordersProp !== undefined
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (controlled || !user) return
    let active = true
    setError(null)
    api.getOrders()
      .then((data) => {
        if (active) setOrders(data)
      })
      .catch(() => {
        if (active) setError("Buyurtmalarni yuklashda xatolik yuz berdi.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [controlled, user])

  // Not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-border-subtle bg-card py-12 text-center">
        <p className="text-muted-foreground">
          Buyurtmalaringizni ko&apos;rish uchun tizimga kiring
        </p>
        <SteamLoginButton size="md" />
      </div>
    )
  }

  const rows = controlled ? ordersProp! : orders
  const isLoading = controlled ? !!loadingProp : loading

  if (error && !isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-card py-12 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-foreground">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-skeleton h-14 w-full rounded-lg bg-surface" />
        ))}
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-border-subtle bg-card py-12 text-center text-muted-foreground">
        Sizda hali buyurtmalar yo&apos;q
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Server</th>
              <th className="px-4 py-3 font-medium">Soatlar</th>
              <th className="px-4 py-3 text-right font-medium">Narx</th>
              <th className="px-4 py-3 font-medium">Sana</th>
              <th className="px-4 py-3 text-right font-medium">Holat</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o: Order) => {
              const colors = STATUS_COLORS[o.status] || STATUS_COLORS.expired
              return (
                <tr
                  key={o.id}
                  className="border-b border-border-subtle transition-colors last:border-0 hover:bg-primary/5"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {o.server?.name || 'Server'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.hours} soat</td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {formatPrice(o.total_price)} UZS
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(o.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{ background: colors.bg, color: colors.text }}
                    >
                      {STATUS_LABELS[o.status] || o.status_display}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
