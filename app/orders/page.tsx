import { SiteShell } from '@/components/site-shell'
import { OrdersTable } from '@/components/orders-table'
import { SectionHeading } from '@/components/ui-bits'

export default function OrdersPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <SectionHeading>Buyurtmalar</SectionHeading>
          <p className="pl-5 text-sm text-muted-foreground">
            Server ijarasi buyurtmalaringiz
          </p>
        </div>
        <OrdersTable />
      </div>
    </SiteShell>
  )
}
