import Link from 'next/link'
import { Logo } from './ui-bits'

const SOCIALS = [
  { name: 'Discord', href: '#' },
  { name: 'Telegram', href: '#' },
  { name: 'YouTube', href: '#' },
  { name: 'Steam', href: '#' },
]

const NAV_LINKS = [
  { label: 'Serverlar', href: '/servers' },
  { label: 'Liderlar', href: '/leaderboard' },
  { label: "Do'kon", href: '/shop' },
  { label: 'Buyurtmalar', href: '/orders' },
  { label: 'Yordam', href: '/help' },
]

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
            O&apos;zbekistonning eng yaxshi CS2 platformasi. Serverlar, rejimlar va
            minimal ping bilan o&apos;yinlar.
          </p>
          <div className="flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                className="rounded-md border border-border-subtle px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-foreground">
            Navigatsiya
          </h3>
          {NAV_LINKS.map((l) => (
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
            Aloqa
          </h3>
          <p className="text-sm text-muted-foreground">support@upg.uz</p>
          <p className="text-sm text-muted-foreground">Toshkent, O&apos;zbekiston</p>
          <p className="mt-4 text-xs text-muted-foreground/70">
            © 2025 UPG. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  )
}
