'use client'

import { useEffect, useState } from 'react'
import { useAuth, useSiteSettings } from './providers'
import { SteamLoginButton } from './steam-login-button'
import { api } from '@/lib/api'
import type { ServerStats } from '@/lib/types'

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

function Stat({
  value,
  suffix = '',
  label,
  icon,
  loading,
}: {
  value: number
  suffix?: string
  label: string
  icon: string
  loading?: boolean
}) {
  const count = useCountUp(value)
  return (
    <div className="flex flex-col items-center rounded-lg border border-border-subtle bg-card/60 px-4 py-3 backdrop-blur-sm sm:items-start">
      {loading ? (
        <div className="animate-skeleton h-7 w-16 rounded bg-surface" />
      ) : (
        <span className="font-heading text-xl font-bold text-primary sm:text-2xl">
          {count.toLocaleString('uz-UZ')}
          {suffix}
        </span>
      )}
      <span className="text-xs text-muted-foreground">
        {icon} {label}
      </span>
    </div>
  )
}

export function Hero() {
  const { user } = useAuth()
  const { settings, settingsLoading } = useSiteSettings()
  const [stats, setStats] = useState<ServerStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    api.getServerStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false))
  }, [])

  return (
    <section className="relative overflow-hidden border-b border-border-subtle">
      {/* Background effects */}
      <div
        className="animate-grid-drift pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(233,30,140,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(233,30,140,0.18), transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(233,30,140,0.08), transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 md:py-24">
        <div className="flex max-w-2xl flex-col gap-5">
          <span className="w-fit rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            {settings?.site_tagline || "CS2 Platforma · O'zbekiston"}
          </span>

          {settingsLoading ? (
            <div className="flex flex-col gap-3">
              <div className="animate-skeleton h-12 w-3/4 rounded bg-surface" />
              <div className="animate-skeleton h-6 w-full rounded bg-surface" />
            </div>
          ) : (
            <>
              <h1 className="text-balance font-heading text-4xl font-bold uppercase leading-[1.05] tracking-tight md:text-6xl">
                {settings?.hero_title?.split('.').map((part, i, arr) => (
                  <span key={i}>
                    {i === arr.length - 1 ? (
                      <span className="text-primary">{part.trim()}</span>
                    ) : (
                      `${part.trim()}. `
                    )}
                  </span>
                )) || (
                  <>O&apos;yna. Yut. <span className="text-primary">Hukmronlik qil</span></>
                )}
              </h1>
              <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {settings?.hero_subtitle ||
                  "O'zbekiston o'yinchilari uchun eng yaxshi CS2 platformasi."}
              </p>
            </>
          )}

          <div className="mt-2 flex flex-wrap gap-3">
            {user ? (
              <a
                href="#servers"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-shadow hover:glow-primary"
              >
                {settings?.hero_cta_text || "O'ynashni boshlash"}
              </a>
            ) : (
              <SteamLoginButton size="lg" />
            )}
            <a
              href="#servers"
              className="rounded-lg border border-primary/50 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary/10"
            >
              Serverlarni ko&apos;rish
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4">
          <Stat
            value={stats?.total_players ?? 0}
            label="onlayn"
            icon="🟢"
            loading={statsLoading}
          />
          <Stat
            value={stats?.online_servers ?? 0}
            label="serverlar"
            icon="🎮"
            loading={statsLoading}
          />
          <Stat
            value={settings?.display_ping ?? 0}
            suffix="ms"
            label="ping"
            icon="⚡"
            loading={settingsLoading}
          />
          <Stat
            value={settings?.display_player_count ?? 0}
            suffix="+"
            label="o'yinchilar"
            icon="🏆"
            loading={settingsLoading}
          />
        </div>
      </div>
    </section>
  )
}
