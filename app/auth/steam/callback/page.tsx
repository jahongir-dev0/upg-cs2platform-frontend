'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth, useToast } from '@/components/providers'

export default function SteamCallbackPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function handleCallback() {
      try {
        // Backend session orqali JWT token oladi
        const data = await api.exchangeSteamToken()
        if (active) {
          setUser(data.user)
          toast("Muvaffaqiyatli kirdingiz!", 'success')
          router.push('/')
        }
      } catch (err) {
        if (active) {
          setError("Steam autentifikatsiya amalga oshmadi. Qaytadan urinib ko'ring.")
          toast("Kirishda xatolik yuz berdi", 'error')
          // 3 sekunddan keyin bosh sahifaga qaytarish
          setTimeout(() => {
            if (active) router.push('/')
          }, 3000)
        }
      }
    }

    handleCallback()
    return () => {
      active = false
    }
  }, [router, setUser, toast])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      {error ? (
        <>
          <div className="h-12 w-12 rounded-full bg-offline/20 flex items-center justify-center">
            <svg className="h-6 w-6 text-offline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-center text-foreground font-medium">{error}</p>
          <p className="text-sm text-muted-foreground">Bosh sahifaga yo&apos;naltirilmoqda...</p>
        </>
      ) : (
        <>
          <div className="relative">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
          <p className="text-center text-foreground font-medium">
            Steam orqali kirilmoqda...
          </p>
          <p className="text-sm text-muted-foreground">Iltimos, kuting</p>
        </>
      )}
    </div>
  )
}
