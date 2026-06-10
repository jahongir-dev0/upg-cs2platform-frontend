'use client'

import { useEffect, useState } from 'react'
import { Eye, EyeOff, X, Loader2 } from 'lucide-react'
import { useAuth, useAuthModal, useToast } from './providers'
import { Logo } from './ui-bits'

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        {...props}
        className="rounded-lg border border-border-subtle bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary/40"
      />
    </label>
  )
}

export function AuthModals() {
  const { modal, openModal, closeModal } = useAuthModal()
  const { login, register } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [username, setUsername] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal()
    }
    if (modal) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [modal, closeModal])

  if (!modal) return null

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      await login(email, password)
      closeModal()
    } catch {
      toast('Не удалось войти. Проверьте данные', 'error')
    } finally {
      setBusy(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password !== password2) {
      toast('Пароли не совпадают', 'error')
      return
    }
    setBusy(true)
    try {
      await register(username, email, password, password2)
      closeModal()
    } catch {
      toast('Не удалось создать аккаунт', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,8,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={closeModal}
    >
      <div
        className="animate-modal-in relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl glow-primary-soft"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={closeModal}
          aria-label="Закрыть"
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo size="md" />
          <h2 className="font-heading text-xl font-bold">
            {modal === 'login'
              ? 'Добро пожаловать в UPG'
              : 'Создайте аккаунт UPG'}
          </h2>
        </div>

        {modal === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Field
              label="Email"
              type="email"
              required
              placeholder="you@upg.uz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-muted-foreground">Пароль</span>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label="Показать пароль"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>
            <SubmitButton busy={busy}>ВОЙТИ В АККАУНТ</SubmitButton>
            <p className="text-center text-sm text-muted-foreground">
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => openModal('register')}
                className="font-medium text-primary hover:underline"
              >
                Зарегистрироваться
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Field
              label="Имя пользователя"
              required
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Field
              label="Email"
              type="email"
              required
              placeholder="you@upg.uz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              label="Пароль"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Field
              label="Повторите пароль"
              type="password"
              required
              placeholder="••••••••"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <SubmitButton busy={busy}>СОЗДАТЬ АККАУНТ</SubmitButton>
            <p className="text-center text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => openModal('login')}
                className="font-medium text-primary hover:underline"
              >
                Войти
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function SubmitButton({
  busy,
  children,
}: {
  busy: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-shadow hover:glow-primary disabled:opacity-60"
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}
