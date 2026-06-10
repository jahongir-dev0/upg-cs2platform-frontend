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
  title: "UPG — O'zbekiston CS2 Platformasi",
  description:
    "UPGrade — O'zbekiston o'yinchilari uchun eng yaxshi CS2 platformasi. O'yin serverlari, liderlar jadvali, rejimlar va o'yinlar.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="uz"
      className={`dark ${inter.variable} ${rajdhani.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
