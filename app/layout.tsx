import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter, Rajdhani, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/providers'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic'],
})
const rajdhani = Rajdhani({
  variable: '--font-rajdhani',
  weight: ['500', '600', '700'],
  subsets: ['latin'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'UPG — CS2 платформа Узбекистана',
  description:
    'UPGrade — лучшая CS2 платформа для игроков Узбекистана. Игровые серверы, лидерборд, режимы и матчи.',
  generator: 'v0.app',
}

export const viewport = {
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`dark ${inter.variable} ${rajdhani.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
