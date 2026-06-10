import { SiteShell } from '@/components/site-shell'
import { SectionHeading } from '@/components/ui-bits'
import { ShoppingBag, Clock } from 'lucide-react'

export default function ShopPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <SectionHeading>Do&apos;kon</SectionHeading>
          <p className="pl-5 text-sm text-muted-foreground">
            Premium obunalar, server ijarasi va boshqa xizmatlar
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-border-subtle bg-card py-24">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold uppercase text-foreground">
              Tez kunda
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Do&apos;kon bo&apos;limi hozirda ishlab chiqilmoqda. Bu yerda premium obunalar,
              server ijarasi va maxsus takliflar mavjud bo&apos;ladi.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm text-primary">
            <Clock className="h-4 w-4" />
            Ishlab chiqilmoqda
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
