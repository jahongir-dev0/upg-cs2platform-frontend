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

/* ---------------- Toasts ---------------- */

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

/* ---------------- Auth ---------------- */

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    username: string,
    email: string,
    password: string,
    password2: string,
  ) => Promise<void>
  logout: () => void
  updateUser: (patch: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AppProviders')
  return ctx
}

/* ---------------- Modal control ---------------- */

type ModalView = 'login' | 'register' | null
interface ModalContextValue {
  modal: ModalView
  openModal: (view: Exclude<ModalView, null>) => void
  closeModal: () => void
}
const ModalContext = createContext<ModalContextValue | null>(null)
export function useAuthModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useAuthModal must be used within AppProviders')
  return ctx
}

/* ---------------- Combined provider ---------------- */

export function AppProviders({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<ModalView>(null)

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  useEffect(() => {
    let active = true
    async function init() {
      if (tokenStore.getAccess()) {
        try {
          const profile = await api.getProfile()
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

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.login(email, password)
      setUser(data.user)
      toast('Вы успешно вошли в аккаунт', 'success')
    },
    [toast],
  )

  const register = useCallback(
    async (
      username: string,
      email: string,
      password: string,
      password2: string,
    ) => {
      const data = await api.register(username, email, password, password2)
      setUser(data.user)
      toast('Аккаунт создан. Добро пожаловать!', 'success')
    },
    [toast],
  )

  const logout = useCallback(() => {
    api.logout()
    setUser(null)
    toast('Вы вышли из аккаунта', 'info')
  }, [toast])

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  const openModal = useCallback((view: Exclude<ModalView, null>) => {
    setModal(view)
  }, [])
  const closeModal = useCallback(() => setModal(null), [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <AuthContext.Provider
        value={{ user, loading, login, register, logout, updateUser }}
      >
        <ModalContext.Provider value={{ modal, openModal, closeModal }}>
          {children}
          <ToastViewport toasts={toasts} />
        </ModalContext.Provider>
      </AuthContext.Provider>
    </ToastContext.Provider>
  )
}
