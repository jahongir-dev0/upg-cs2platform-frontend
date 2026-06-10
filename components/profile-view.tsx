'use client'

import { useEffect, useState } from 'react'
import { Crown } from 'lucide-react'
import { useAuth, useAuthModal } from './providers'
import { api } from '@/lib/api'
import type { Order } from '@/lib/types'
import { OrdersTable } from './orders-table'
import { cn } from '@/lib/utils'

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-1 font-heading text-xl font-bold',
          accent ? 'text-primary' : 'text-foreground',
        )}
      >
        {value}
      </p>
    </div>
  )
}

function fmtPlaytime(minutes: number) {
  const h = Math.floor(minutes / 60)
  return `${h.toLocaleString('ru-RU')}ч`
}

export function ProfileView() {
  const { user } = useAuth()
  const { openModal } = useAuthModal()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let active = true
    api.getOrders().then((data) => {
      if (active) {
        setOrders(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [user])

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground">
          Требуется вход
        </h1>
        <p className="mt-3 text-muted-foreground">
          Войдите в аккаунт, чтобы открыть профиль.
        </p>
        <button
          onClick={() => openModal('login')}
          className="mt-6 rounded-md bg-primary px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:glow-primary"
        >
          Войти
        </button>
      </div>
    )
  }

  const totalGames = user.stats.wins + user.stats.losses
  const winRate = totalGames ? Math.round((user.stats.wins / totalGames) * 100) : 0

  return (
    <div className="space-y-8 py-8">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-28 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
        <div className="flex flex-col items-center gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <img
            src={user.avatar || '/placeholder.svg'}
            alt={user.username}
            className="-mt-12 h-24 w-24 rounded-xl border-4 border-card object-cover"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground">
                {user.username}
              </h1>
              {user.premium && (
                <span
                  className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase"
                  style={{ background: 'rgba(255,215,0,0.12)', color: 'var(--gold)' }}
                >
                  <Crown className="h-3 w-3" /> Premium
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.email} · С нами с{' '}
              {new Date(user.joinDate).toLocaleDateString('ru-RU')}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Steam ID: {user.steamId}
            </p>
          </div>
          <div className="rounded-lg border border-border-subtle bg-surface px-5 py-3 text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Баланс</p>
            <p className="font-heading text-2xl font-bold text-primary">
              {user.balance.toLocaleString('ru-RU')} UZS
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Рейтинг" value={user.stats.rating.toLocaleString('ru-RU')} accent />
        <Stat label="К/Д" value={user.stats.kd.toFixed(2)} />
        <Stat label="Винрейт" value={`${winRate}%`} />
        <Stat label="HS %" value={`${user.stats.hsPercent}%`} />
        <Stat label="Убийств" value={user.stats.kills.toLocaleString('ru-RU')} />
        <Stat label="Время" value={fmtPlaytime(user.stats.playtime)} />
      </div>

      <div>
        <h2 className="mb-4 font-heading text-xl font-bold uppercase tracking-wide text-foreground">
          Последние заказы
        </h2>
        <OrdersTable orders={orders} loading={loading} />
      </div>
    </div>
  )
}
