import { SiteShell } from '@/components/site-shell'
import { Hero } from '@/components/hero'
import { ServerBrowser } from '@/components/server-browser'
import { SectionHeading } from '@/components/ui-bits'

export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
      <div id="servers" className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex flex-col gap-2">
          <SectionHeading>Игровые серверы</SectionHeading>
          <p className="pl-5 text-sm text-muted-foreground">
            Выберите режим и подключайтесь в один клик
          </p>
        </div>
        <ServerBrowser />
      </div>
    </SiteShell>
  )
}
