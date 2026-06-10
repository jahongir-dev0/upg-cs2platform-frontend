'use client'

import { useEffect, useState } from 'react'
import { useAuth, useAuthModal } from './providers'

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
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
}: {
  value: number
  suffix?: string
  label: string
}) {
  const count = useCountUp(value)
  return (
    <div className="flex flex-col items-center rounded-lg border border-border-subtle bg-card/60 px-4 py-3 backdrop-blur-sm sm:items-start">
      <span className="font-heading text-xl font-bold text-primary sm:text-2xl">
        {count.toLocaleString('ru-RU')}
        {suffix}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export function Hero() {
  const { user } = useAuth()
  const { openModal } = useAuthModal()

  return (
    <section className="relative overflow-hidden border-b border-border-subtle">
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

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 md:py-24">
        <div className="flex max-w-2xl flex-col gap-5">
          <span className="w-fit rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            CS2 Platform · Uzbekistan
          </span>
          <h1 className="text-balance font-heading text-4xl font-bold uppercase leading-[1.05] tracking-tight md:text-6xl">
            Играй. Выигрывай.{' '}
            <span className="text-primary">Доминируй</span>
          </h1>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Лучшая CS2 платформа для игроков Узбекистана. Десятки режимов,
            минимальный пинг и честные матчи.
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <button
              onClick={() => (user ? null : openModal('register'))}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-shadow hover:glow-primary"
            >
              Начать играть
            </button>
            <a
              href="#servers"
              className="rounded-lg border border-primary/50 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-primary/10"
            >
              Смотреть серверы
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:max-w-2xl sm:grid-cols-4">
          <Stat value={247} label="🟢 онлайн" />
          <Stat value={12} label="🎮 режимов" />
          <Stat value={20} suffix="ms" label="⚡ пинг" />
          <Stat value={5000} suffix="+" label="🏆 игроков" />
        </div>
      </div>
    </section>
  )
}
