'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/lib/types'
import { api, tokenStore } from '@/lib/api'

/* ─── Toasts ─────────────────────────────────────────────────────────────── */

type ToastType = 'success' | 'error' | 'info'
interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within AppProviders')
  return ctx
}

function ToastViewport({ toasts }: { toasts: Toast[] }) {
  const colors: Record<ToastType, string> = {
    success: 'var(--online)',
    error: 'var(--offline)',
    info: 'var(--primary)',
  }
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="animate-toast-in pointer-events-auto flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm shadow-lg"
          style={{ borderColor: colors[t.type] }}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{
              background: colors[t.type],
              boxShadow: `0 0 8px ${colors[t.type]}`,
            }}
          />
          <span className="text-foreground">{t.message}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Auth Context ───────────────────────────────────────────────────────── */

interface AuthContextValue {
  user: User | null
  loading: boolean
  steamLogin: () => void
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AppProviders')
  return ctx
}

/* ─── Combined Provider ──────────────────────────────────────────────────── */

export function AppProviders({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  // Initialize: check if user has valid token
  useEffect(() => {
    let active = true
    async function init() {
      if (tokenStore.getAccess()) {
        try {
          const profile = await api.getMe()
          if (active) setUser(profile)
        } catch {
          tokenStore.clear()
        }
      }
      if (active) setLoading(false)
    }
    init()
    return () => {
      active = false
    }
  }, [])

  const steamLogin = useCallback(() => {
    // Steam OpenID ga redirect qiladi
    window.location.href = api.getSteamLoginUrl()
  }, [])

  const logout = useCallback(async () => {
    await api.logout()
    setUser(null)
    toast("Hisobdan muvaffaqiyatli chiqdingiz", 'info')
  }, [toast])

  return (
    <ToastContext.Provider value={{ toast }}>
      <AuthContext.Provider value={{ user, loading, steamLogin, logout, setUser }}>
        {children}
        <ToastViewport toasts={toasts} />
      </AuthContext.Provider>
    </ToastContext.Provider>
  )
}
