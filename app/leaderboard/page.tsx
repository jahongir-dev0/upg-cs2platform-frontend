import { SiteShell } from '@/components/site-shell'
import { LeaderboardTable } from '@/components/leaderboard-table'
import { SectionHeading } from '@/components/ui-bits'

export default function LeaderboardPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <SectionHeading>Liderlar jadvali</SectionHeading>
          <p className="pl-5 text-sm text-muted-foreground">
            Eng yaxshi o&apos;yinchilar reytingi
          </p>
        </div>
        <LeaderboardTable />
      </div>
    </SiteShell>
  )
}
