'use client'

import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModeTab {
  label: string
  count: number
}

export function ModeTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: ModeTab[]
  active: string
  onChange: (label: string) => void
}) {
  return (
    <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-dashed border-primary/50 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
        <Plus className="h-4 w-4" />
        СОЗДАТЬ ЛОББИ
      </button>
      <button
        onClick={() => onChange('all')}
        className={cn(
          'shrink-0 rounded-lg px-4 py-2 text-sm font-semibold tracking-wide transition-colors',
          active === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'border border-border-subtle text-muted-foreground hover:border-primary/40 hover:text-foreground',
        )}
      >
        ВСЕ
      </button>
      {tabs.map((tab) => {
        const isActive = active === tab.label
        return (
          <button
            key={tab.label}
            onClick={() => onChange(tab.label)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold tracking-wide transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'border border-border-subtle text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={cn(
                  'rounded-full px-1.5 text-[10px] font-bold',
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-primary/20 text-primary',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
