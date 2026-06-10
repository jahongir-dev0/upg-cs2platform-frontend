import { SiteShell } from '@/components/site-shell'
import { SectionHeading } from '@/components/ui-bits'
import { HelpCircle, MessageCircle, Server, CreditCard, Shield } from 'lucide-react'

const FAQ = [
  {
    icon: Server,
    question: "Serverga qanday ulanaman?",
    answer:
      "Server kartochkasidagi \"Ulanish\" tugmasini bosing yoki IP manzilni nusxalab CS2 konsoliga \"connect IP\" yozing.",
  },
  {
    icon: CreditCard,
    question: "Server ijarasi qanday ishlaydi?",
    answer:
      "Serverlar sahifasida kerakli serverni tanlang, soat miqdorini belgilang va buyurtma bering. Balans yetarli bo'lsa, server darhol faollashadi.",
  },
  {
    icon: Shield,
    question: "Premium obuna nima beradi?",
    answer:
      "Premium foydalanuvchilar maxsus serverlarga kirish, ustuvor navbat, va eksklyuziv rejimlardan foydalanish imkoniyatiga ega.",
  },
  {
    icon: MessageCircle,
    question: "Qo'llab-quvvatlash xizmatiga qanday murojaat qilaman?",
    answer:
      "Telegram guruhimiz orqali yoki support@upg.uz elektron pochta manziliga yozing. Biz 24 soat ichida javob beramiz.",
  },
]

export default function HelpPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <SectionHeading>Yordam</SectionHeading>
          <p className="pl-5 text-sm text-muted-foreground">
            Ko&apos;p so&apos;raladigan savollar va qo&apos;llab-quvvatlash
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {FAQ.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-border-subtle bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  {item.question}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

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
              href="https://t.me/upg_support"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold uppercase text-primary-foreground transition-shadow hover:glow-primary"
            >
              Telegram orqali yozish
            </a>
            <a
              href="mailto:support@upg.uz"
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
