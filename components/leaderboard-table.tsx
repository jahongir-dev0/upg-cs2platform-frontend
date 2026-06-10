'use client'

import { useEffect, useState } from 'react'
import { Crown, AlertCircle } from 'lucide-react'
import type { LeaderboardEntry } from '@/lib/types'
import { api } from '@/lib/api'
import { useAuth } from './providers'
import { cn } from '@/lib/utils'

const PERIODS = ['BUGUN', 'HAFTA', 'OY', 'BARCHA VAQT']

const MEDAL: Record<number, string> = {
  1: 'var(--gold)',
  2: '#C0C0C0',
  3: '#CD7F32',
}

export function LeaderboardTable() {
  const { user } = useAuth()
  const [rows, setRows] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState(PERIODS[3])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    api.getLeaderboard()
      .then((data) => {
        if (active) setRows(data)
      })
      .catch(() => {
        if (active) setError("Liderlar jadvalini yuklashda xatolik yuz berdi.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  if (error && !loading) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-card py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-foreground font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          Qayta urinish
        </button>
      </div>
    )
  }

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
                <th className="px-4 py-3 font-medium">O&apos;yinchi</th>
                <th className="px-4 py-3 text-right font-medium">Reyting</th>
                <th className="px-4 py-3 text-right font-medium">K/D</th>
                <th className="px-4 py-3 text-right font-medium">G&apos;alabalar</th>
                <th className="px-4 py-3 text-right font-medium">O&apos;ldirish</th>
                <th className="px-4 py-3 text-right font-medium">Vaqt</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-border-subtle">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="animate-skeleton h-5 w-full rounded bg-surface" />
                      </td>
                    </tr>
                  ))
                : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      Liderlar jadvali bo&apos;sh. O&apos;yinchilar serverda o&apos;ynaganda ma&apos;lumotlar paydo bo&apos;ladi.
                    </td>
                  </tr>
                ) : rows.map((row: LeaderboardEntry, index: number) => {
                    const rank = index + 1
                    const isOwn = user?.username === row.username
                    return (
                      <tr
                        key={rank}
                        className={cn(
                          'border-b border-border-subtle transition-colors hover:bg-primary/5',
                          isOwn && 'bg-primary/5 ring-1 ring-inset ring-primary/30',
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {rank <= 3 ? (
                              <Crown
                                className="h-4 w-4"
                                style={{ color: MEDAL[rank] }}
                              />
                            ) : null}
                            <span
                              className={cn(
                                'font-mono',
                                rank <= 3 ? 'font-bold' : 'text-muted-foreground',
                              )}
                            >
                              {rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={row.avatar || '/placeholder-user.jpg'}
                              alt={row.username}
                              className="h-7 w-7 rounded-full object-cover ring-1 ring-border"
                            />
                            <span className="font-medium">{row.username}</span>
                            {row.is_premium && (
                              <Crown className="h-3 w-3" style={{ color: 'var(--gold)' }} />
                            )}
                            {isOwn && (
                              <span className="rounded bg-primary/20 px-1.5 text-[10px] font-bold text-primary">
                                SIZ
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-primary">
                          {row.rating.toLocaleString('uz-UZ')}
                        </td>
                        <td className="px-4 py-3 text-right">{row.kd_ratio.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {row.wins}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {row.kills.toLocaleString('uz-UZ')}
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {Math.round(row.play_time_hours)} soat
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
