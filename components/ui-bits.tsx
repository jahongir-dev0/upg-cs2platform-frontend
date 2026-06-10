import { cn } from '@/lib/utils'

export function Logo({
  className,
  size = 'md',
}: {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const text = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  }[size]
  return (
    <span
      className={cn('relative inline-flex select-none items-center', className)}
      aria-label="UPG"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-1 -right-1 top-1/2 h-px -translate-y-1/2 rotate-[-18deg] bg-primary/70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-1 -right-1 top-1/2 h-px -translate-y-1/2 rotate-[18deg] bg-primary/40"
      />
      <span
        className={cn(
          'font-heading font-bold tracking-tight text-foreground',
          text,
        )}
      >
        UPG
      </span>
    </span>
  )
}

export function StatusDot({
  online,
  className,
}: {
  online: boolean
  className?: string
}) {
  const color = online ? 'var(--online)' : 'var(--offline)'
  return (
    <span
      className={cn(
        'inline-block h-2 w-2 shrink-0 rounded-full',
        online && 'animate-pulse-dot',
        className,
      )}
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      aria-hidden
    />
  )
}

export function PlayerBar({
  current,
  max,
}: {
  current: number
  max: number
}) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{
          width: `${pct}%`,
          boxShadow: '0 0 8px rgba(233,30,140,0.6)',
        }}
      />
    </div>
  )
}

export function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <span className="h-6 w-1 rounded-full bg-primary" />
      <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
        {children}
      </h1>
    </div>
  )
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('divider-glow w-full', className)} />
}
