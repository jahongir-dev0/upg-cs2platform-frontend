'use client'

import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List, RefreshCw, Search, AlertCircle } from 'lucide-react'
import type { GameServer, ServerCategory } from '@/lib/types'
import { api } from '@/lib/api'
import { ModeTabs } from './mode-tabs'
import {
  ServerCardGrid,
  ServerRowList,
  ServerSkeleton,
} from './server-card'
import { cn } from '@/lib/utils'

export function ServerBrowser({ showTabs = true }: { showTabs?: boolean }) {
  const [servers, setServers] = useState<GameServer[]>([])
  const [categories, setCategories] = useState<ServerCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [onlyOnline, setOnlyOnline] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [serverData, catData] = await Promise.all([
        api.getServers(),
        api.getServerCategories(),
      ])
      setServers(serverData)
      setCategories(catData)
    } catch (e) {
      setError("Serverlarni yuklashda xatolik yuz berdi. Backend ishlab turishini tekshiring.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const tabs = useMemo(() => {
    return categories.map((cat: ServerCategory) => ({
      label: cat.name,
      count: cat.server_count,
    }))
  }, [categories])

  const filtered = useMemo((): GameServer[] => {
    return servers.filter((s: GameServer) => {
      if (activeCategory !== 'all' && s.category?.name !== activeCategory) return false
      if (onlyOnline && s.status !== 'online') return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !s.map_name.toLowerCase().includes(q) &&
          !s.name.toLowerCase().includes(q) &&
          !s.ip_address.includes(q)
        )
          return false
      }
      return true
    })
  }, [servers, activeCategory, onlyOnline, search])

  // Error state
  if (error && !loading) {
    return (
      <section className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-card py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-foreground font-medium">{error}</p>
        <button
          onClick={load}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-shadow hover:glow-primary"
        >
          Qayta urinish
        </button>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-5">
      {showTabs && tabs.length > 0 && (
        <ModeTabs tabs={tabs} active={activeCategory} onChange={setActiveCategory} />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 sm:min-w-[200px] sm:flex-none">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Xarita bo'yicha qidirish..."
            className="w-full rounded-lg border border-border-subtle bg-card py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/50 sm:w-56"
          />
        </div>

        <button
          onClick={() => setOnlyOnline((v) => !v)}
          className={cn(
            'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
            onlyOnline
              ? 'border-online/60 text-online'
              : 'border-border-subtle text-muted-foreground hover:text-foreground',
          )}
        >
          Faqat onlayn
        </button>

        <button
          onClick={load}
          aria-label="Yangilash"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </button>

        <div className="ml-auto flex items-center gap-1 rounded-lg border border-border-subtle p-1">
          <button
            onClick={() => setView('grid')}
            aria-label="Katakcha"
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
            aria-label="Ro'yxat"
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
          {Array.from({ length: 8 }).map((_, i) => (
            <ServerSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-border-subtle bg-card py-16 text-center text-muted-foreground">
          {servers.length === 0
            ? "Hali serverlar qo'shilmagan. Admin paneldan server qo'shing."
            : "Qidiruv natijasida server topilmadi"}
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s: GameServer) => (
            <ServerCardGrid key={s.id} server={s} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((s: GameServer) => (
            <ServerRowList key={s.id} server={s} />
          ))}
        </div>
      )}
    </section>
  )
}
