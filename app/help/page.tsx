'use client'

import { useEffect, useState } from 'react'
import { HelpCircle, Server, CreditCard, Shield, MessageCircle, Trophy, Users, AlertCircle } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { SectionHeading } from '@/components/ui-bits'
import { useSiteSettings } from '@/components/providers'
import { api } from '@/lib/api'
import type { FAQItem } from '@/lib/types'

const ICON_MAP: Record<string, typeof Server> = {
  server: Server,
  credit_card: CreditCard,
  shield: Shield,
  message: MessageCircle,
  help: HelpCircle,
  gamepad: HelpCircle,
  trophy: Trophy,
  users: Users,
}

export default function HelpPage() {
  const { settings } = useSiteSettings()
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getFAQ()
      .then(setFaqs)
      .catch(() => setError("FAQ ma'lumotlarini yuklashda xatolik yuz berdi."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <SectionHeading>Yordam</SectionHeading>
          <p className="pl-5 text-sm text-muted-foreground">
            Ko&apos;p so&apos;raladigan savollar va qo&apos;llab-quvvatlash
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-skeleton h-40 rounded-xl bg-surface" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-card py-16 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-foreground font-medium">{error}</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="rounded-xl border border-border-subtle bg-card py-16 text-center text-muted-foreground">
            Hali FAQ savollar qo&apos;shilmagan. Admin paneldan qo&apos;shing.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((item: FAQItem) => {
              const Icon = ICON_MAP[item.icon] || HelpCircle
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border-subtle bg-card p-6 transition-colors hover:border-primary/30"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {item.question}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Contact section */}
        <div className="mt-10 rounded-xl border border-border bg-card p-8 text-center">
          <HelpCircle className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            Savolingiz bormi?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Bizning qo&apos;llab-quvvatlash jamoamiz sizga yordam berishga tayyor
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={settings?.telegram_url || 'https://t.me/upg_support'}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold uppercase text-primary-foreground transition-shadow hover:glow-primary"
            >
              Telegram orqali yozish
            </a>
            <a
              href={`mailto:${settings?.support_email || 'support@upg.uz'}`}
              className="rounded-lg border border-primary/50 px-6 py-3 text-sm font-semibold uppercase text-primary transition-colors hover:bg-primary/10"
            >
              Email yuborish
            </a>
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
