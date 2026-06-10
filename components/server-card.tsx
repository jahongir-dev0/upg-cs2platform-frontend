'use client'

import { Copy, Crown, Lock, Play } from 'lucide-react'
import type { GameServer } from '@/lib/types'
import { PlayerBar, StatusDot } from './ui-bits'
import { useToast } from './providers'
import { cn } from '@/lib/utils'

function copyConnect(server: GameServer, toast: (m: string, t?: any) => void) {
  const cmd = `connect ${server.ip}`
  if (navigator.clipboard) {
    navigator.clipboard.writeText(cmd).catch(() => {})
  }
  toast(`Скопировано: ${cmd}`, 'success')
}

export function ServerCardGrid({ server }: { server: GameServer }) {
  const { toast } = useToast()
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-card transition-all hover:bg-card-hover hover:glow-primary-soft',
        server.premium ? 'border-l-2' : 'border-border',
      )}
      style={server.premium ? { borderLeftColor: 'var(--gold)' } : undefined}
    >
      <div className="relative h-28 w-full overflow-hidden">
        <img
          src={server.image || '/placeholder.svg'}
          alt={`${server.map} map`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        <div className="absolute right-2 top-2 flex gap-1.5">
          {server.premium && (
            <span
              className="flex h-6 w-6 items-center justify-center rounded bg-black/50"
              title="Premium"
            >
              <Crown className="h-3.5 w-3.5" style={{ color: 'var(--gold)' }} />
            </span>
          )}
          {server.locked && (
            <span className="flex h-6 w-6 items-center justify-center rounded bg-black/50">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
          )}
          <button
            onClick={() => copyConnect(server, toast)}
            aria-label="Скопировать IP"
            className="flex h-6 w-6 items-center justify-center rounded bg-black/50 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex items-center gap-2">
          <StatusDot online={server.status === 'online'} />
          <span className="font-heading text-sm font-bold tracking-wide">
            #{server.number} {server.name}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {server.players}/{server.maxPlayers} — {server.map}
          </span>
          <span>
            {server.locationFlag} {server.ping}ms
          </span>
        </div>
        <PlayerBar current={server.players} max={server.maxPlayers} />
        <a
          href={`steam://connect/${server.ip}`}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-md bg-surface px-3 py-2 text-xs font-semibold uppercase tracking-wide text-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
        >
          <Play className="h-3.5 w-3.5" />
          Подключиться
        </a>
      </div>
    </div>
  )
}

export function ServerRowList({ server }: { server: GameServer }) {
  const { toast } = useToast()
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-card-hover',
        server.premium ? 'border-l-2' : 'border-border',
      )}
      style={server.premium ? { borderLeftColor: 'var(--gold)' } : undefined}
    >
      <StatusDot online={server.status === 'online'} />
      <div className="flex min-w-0 items-center gap-2">
        {server.premium && (
          <Crown className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--gold)' }} />
        )}
        <span className="font-heading text-sm font-bold tracking-wide">
          #{server.number} {server.name}
        </span>
      </div>
      <span className="hidden w-28 shrink-0 text-xs text-muted-foreground sm:block">
        {server.map}
      </span>
      <div className="hidden w-24 shrink-0 items-center gap-2 md:flex">
        <span className="w-10 text-right text-xs text-muted-foreground">
          {server.players}/{server.maxPlayers}
        </span>
        <PlayerBar current={server.players} max={server.maxPlayers} />
      </div>
      <span className="hidden flex-1 truncate font-mono text-xs text-muted-foreground lg:block">
        {server.ip}
      </span>
      <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
        {server.locationFlag} {server.ping}ms
      </span>
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <a
          href={`steam://connect/${server.ip}`}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold uppercase text-primary-foreground transition-shadow hover:glow-primary"
        >
          Connect
        </a>
        <button
          onClick={() => copyConnect(server, toast)}
          aria-label="Скопировать IP"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <Copy className="h-4 w-4" />
        </button>
        {server.locked && (
          <span className="flex h-8 w-8 items-center justify-center text-muted-foreground">
            <Lock className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  )
}

export function ServerSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="animate-skeleton h-28 w-full bg-surface" />
      <div className="flex flex-col gap-3 p-3">
        <div className="animate-skeleton h-4 w-2/3 rounded bg-surface" />
        <div className="animate-skeleton h-3 w-1/2 rounded bg-surface" />
        <div className="animate-skeleton h-1 w-full rounded bg-surface" />
        <div className="animate-skeleton h-8 w-full rounded bg-surface" />
      </div>
    </div>
  )
}
