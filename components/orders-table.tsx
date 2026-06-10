'use client'

import { useEffect, useState } from 'react'
import type { Order } from '@/lib/types'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

function formatPrice(n: number) {
  return new Intl.NumberFormat('ru-RU').format(n)
}

interface OrdersTableProps {
  orders?: Order[]
  loading?: boolean
}

export function OrdersTable({ orders: ordersProp, loading: loadingProp }: OrdersTableProps) {
  const controlled = ordersProp !== undefined
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (controlled) return
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
  }, [controlled])

  const rows = controlled ? ordersProp! : orders
  const isLoading = controlled ? !!loadingProp : loading

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
        У вас пока нет заказов
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Сервер</th>
              <th className="px-4 py-3 font-medium">Часы</th>
              <th className="px-4 py-3 text-right font-medium">Цена</th>
              <th className="px-4 py-3 font-medium">Дата</th>
              <th className="px-4 py-3 text-right font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.id}
                className="border-b border-border-subtle transition-colors last:border-0 hover:bg-primary/5"
              >
                <td className="px-4 py-3 font-medium text-foreground">{o.serverName}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.hours}ч</td>
                <td className="px-4 py-3 text-right text-foreground">{formatPrice(o.price)} UZS</td>
                <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-semibold',
                      o.status === 'active'
                        ? 'bg-online/15 text-online'
                        : 'bg-offline/15 text-offline',
                    )}
                    style={{
                      background:
                        o.status === 'active'
                          ? 'rgba(0,230,118,0.12)'
                          : 'rgba(255,23,68,0.12)',
                    }}
                  >
                    {o.status === 'active' ? 'Активен' : 'Истёк'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
