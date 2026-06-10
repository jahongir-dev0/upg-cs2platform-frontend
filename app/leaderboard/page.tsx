import { SiteShell } from '@/components/site-shell'
import { LeaderboardTable } from '@/components/leaderboard-table'
import { SectionHeading } from '@/components/ui-bits'

export const metadata = {
  title: 'Лидерборд — UPG',
}

export default function LeaderboardPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <SectionHeading>Лидерборд</SectionHeading>
          <p className="pl-5 text-sm text-muted-foreground">
            Топ-50 игроков платформы UPG
          </p>
        </div>
        <LeaderboardTable />
      </div>
    </SiteShell>
  )
}
