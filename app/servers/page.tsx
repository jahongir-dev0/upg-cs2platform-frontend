import { SiteShell } from '@/components/site-shell'
import { ServerBrowser } from '@/components/server-browser'
import { SectionHeading } from '@/components/ui-bits'

export const metadata = {
  title: 'Серверы — UPG',
}

export default function ServersPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <SectionHeading>Серверы</SectionHeading>
          <p className="pl-5 text-sm text-muted-foreground">
            Все игровые серверы UPG с фильтрами по режимам и локациям
          </p>
        </div>
        <ServerBrowser />
      </div>
    </SiteShell>
  )
}
