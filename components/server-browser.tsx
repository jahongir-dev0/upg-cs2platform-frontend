'use client'

import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List, RefreshCw, Search } from 'lucide-react'
import type { GameServer } from '@/lib/types'
import { api } from '@/lib/api'
import { ModeTabs } from './mode-tabs'
import {
  ServerCardGrid,
  ServerRowList,
  ServerSkeleton,
} from './server-card'
import { cn } from '@/lib/utils'

const LOCATIONS = ['all', 'Tashkent', 'Almaty', 'Moscow', 'Frankfurt']

export function ServerBrowser({ showTabs = true }: { showTabs?: boolean }) {
  const [servers, setServers] = useState<GameServer[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [mode, setMode] = useState('all')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('all')
  const [onlyOnline, setOnlyOnline] = useState(false)

  async function load() {
    setLoading(true)
    const data = await api.getServers()
    setServers(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const tabs = useMemo(() => {
    const modes = Array.from(new Set(servers.map((s) => s.name)))
    return modes.map((m) => ({
      label: m,
      count: servers.filter((s) => s.name === m && s.status === 'online')
        .length,
    }))
  }, [servers])

  const filtered = useMemo(() => {
    return servers.filter((s) => {
      if (mode !== 'all' && s.name !== mode) return false
      if (location !== 'all' && s.location !== location) return false
      if (onlyOnline && s.status !== 'online') return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !s.map.toLowerCase().includes(q) &&
          !s.name.toLowerCase().includes(q) &&
          !String(s.number).includes(q)
        )
          return false
      }
      return true
    })
  }, [servers, mode, location, onlyOnline, search])

  return (
    <section className="flex flex-col gap-5">
      {showTabs && (
        <ModeTabs tabs={tabs} active={mode} onChange={setMode} />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 sm:min-w-[200px] sm:flex-none">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по карте..."
            className="w-full rounded-lg border border-border-subtle bg-card py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/50 sm:w-56"
          />
        </div>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-lg border border-border-subtle bg-card px-3 py-2 text-sm text-muted-foreground outline-none transition-colors focus:border-primary/50"
        >
          {LOCATIONS.map((l) => (
            <option key={l} value={l} className="bg-card">
              {l === 'all' ? 'Локация: Все' : l}
            </option>
          ))}
        </select>

        <button
          onClick={() => setOnlyOnline((v) => !v)}
          className={cn(
            'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
            onlyOnline
              ? 'border-online/60 text-online'
              : 'border-border-subtle text-muted-foreground hover:text-foreground',
          )}
        >
          Только онлайн
        </button>

        <button
          onClick={load}
          aria-label="Обновить"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </button>

        <div className="ml-auto flex items-center gap-1 rounded-lg border border-border-subtle p-1">
          <button
            onClick={() => setView('grid')}
            aria-label="Сетка"
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded',
              view === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            aria-label="Список"
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded',
              view === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ServerSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-border-subtle bg-card py-16 text-center text-muted-foreground">
          Серверы не найдены
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <ServerCardGrid key={s.id} server={s} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((s) => (
            <ServerRowList key={s.id} server={s} />
          ))}
        </div>
      )}
    </section>
  )
}
