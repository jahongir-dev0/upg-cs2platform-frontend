import Link from 'next/link'
import { Logo } from './ui-bits'

const SOCIALS = ['Discord', 'Telegram', 'YouTube', 'Steam']

export function Footer() {
  return (
    <footer
      className="mt-16 border-t"
      style={{
        background: '#0d0d14',
        borderColor: 'rgba(233,30,140,0.2)',
      }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Logo size="md" />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Лучшая CS2 платформа Узбекистана. Серверы, режимы и матчи с
            минимальным пингом.
          </p>
          <div className="flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s}
                href="#"
                className="rounded-md border border-border-subtle px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
            Навигация
          </h3>
          {[
            { label: 'Серверы', href: '/servers' },
            { label: 'Лидерборд', href: '/leaderboard' },
            { label: 'Магазин', href: '/servers' },
            { label: 'Помощь', href: '/leaderboard' },
            { label: 'О нас', href: '/' },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
            Контакты
          </h3>
          <p className="text-sm text-muted-foreground">support@upg.uz</p>
          <p className="text-sm text-muted-foreground">Ташкент, Узбекистан</p>
          <p className="mt-4 text-xs text-muted-foreground/70">
            © 2025 UPG. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
