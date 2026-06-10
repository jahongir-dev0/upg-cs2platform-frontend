'use client'

import { useEffect, useState } from 'react'
import { Crown } from 'lucide-react'
import type { LeaderboardEntry } from '@/lib/types'
import { api } from '@/lib/api'
import { useAuth } from './providers'
import { cn } from '@/lib/utils'

const PERIODS = ['СЕГОДНЯ', 'НЕДЕЛЯ', 'МЕСЯЦ', 'ВСЕ ВРЕМЯ']

const MEDAL: Record<number, string> = {
  1: 'var(--gold)',
  2: '#C0C0C0',
  3: '#CD7F32',
}

export function LeaderboardTable() {
  const { user } = useAuth()
  const [rows, setRows] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(PERIODS[3])

  useEffect(() => {
    let active = true
    setLoading(true)
    api.getLeaderboard().then((data) => {
      if (active) {
        setRows(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'shrink-0 rounded-lg px-4 py-2 text-sm font-semibold tracking-wide transition-colors',
              period === p
                ? 'bg-primary text-primary-foreground'
                : 'border border-border-subtle text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border-subtle bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Игрок</th>
                <th className="px-4 py-3 text-right font-medium">Рейтинг</th>
                <th className="px-4 py-3 text-right font-medium">К/Д</th>
                <th className="px-4 py-3 text-right font-medium">Побед</th>
                <th className="px-4 py-3 text-right font-medium">Убийств</th>
                <th className="px-4 py-3 text-right font-medium">Время</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <tr key={i} className="border-b border-border-subtle">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="animate-skeleton h-5 w-full rounded bg-surface" />
                      </td>
                    </tr>
                  ))
                : rows.map((row) => {
                    const isOwn = user?.username === row.username
                    return (
                      <tr
                        key={row.rank}
                        className={cn(
                          'border-b border-border-subtle transition-colors hover:bg-primary/5',
                          isOwn && 'bg-primary/5 ring-1 ring-inset ring-primary/30',
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {row.rank <= 3 ? (
                              <Crown
                                className="h-4 w-4"
                                style={{ color: MEDAL[row.rank] }}
                              />
                            ) : null}
                            <span
                              className={cn(
                                'font-mono',
                                row.rank <= 3
                                  ? 'font-bold'
                                  : 'text-muted-foreground',
                              )}
                            >
                              {row.rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={row.avatar || '/placeholder.svg'}
                              alt={row.username}
                              className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
                            />
                            <span className="font-medium">{row.username}</span>
                            {isOwn && (
                              <span className="rounded bg-primary/20 px-1.5 text-[10px] font-bold text-primary">
                                ВЫ
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-primary">
                          {row.rating.toLocaleString('ru-RU')}
                        </td>
                        <td className="px-4 py-3 text-right">{row.kd.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {row.wins}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {row.kills.toLocaleString('ru-RU')}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {row.hours}ч
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
