import { SiteShell } from '@/components/site-shell'
import { ServerBrowser } from '@/components/server-browser'
import { SectionHeading } from '@/components/ui-bits'

export default function ServersPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <SectionHeading>Serverlar</SectionHeading>
          <p className="pl-5 text-sm text-muted-foreground">
            Barcha mavjud CS2 serverlar ro&apos;yxati
          </p>
        </div>
        <ServerBrowser />
      </div>
    </SiteShell>
  )
}
