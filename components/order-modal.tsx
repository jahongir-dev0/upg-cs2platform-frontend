'use client'

import { useState } from 'react'
import { X, Loader2, Clock, Server, AlertTriangle } from 'lucide-react'
import type { GameServer } from '@/lib/types'
import { api } from '@/lib/api'
import { useAuth, useToast } from './providers'
import { cn } from '@/lib/utils'

function formatPrice(n: number) {
  return new Intl.NumberFormat('uz-UZ').format(n)
}

interface OrderModalProps {
  server: GameServer
  onClose: () => void
  onSuccess: () => void
}

const HOUR_OPTIONS = [1, 2, 3, 6, 12, 24]

export function OrderModal({ server, onClose, onSuccess }: OrderModalProps) {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [hours, setHours] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const totalPrice = server.price_per_hour * hours
  const hasBalance = user ? user.balance >= totalPrice : false

  async function handleSubmit() {
    if (!user || submitting) return

    setSubmitting(true)
    try {
      await api.createOrder(server.id, hours)
      toast(`Buyurtma yaratildi! ${server.name} — ${hours} soat`, 'success')
      await refreshUser()
      onSuccess()
      onClose()
    } catch (e: unknown) {
      const err = e as { data?: { detail?: string } }
      toast(err?.data?.detail || "Buyurtma yaratishda xatolik yuz berdi", 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,8,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="animate-modal-in relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl glow-primary-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h2 className="font-heading text-xl font-bold uppercase text-foreground">
            Server ijarasi
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {server.name} — {server.map_name}
          </p>
        </div>

        {/* Server info */}
        <div className="mb-6 rounded-lg border border-border-subtle bg-surface p-4">
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">{server.name}</p>
              <p className="text-xs text-muted-foreground">
                {server.ip_address}:{server.port} · {server.map_name}
              </p>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Narx: <span className="text-foreground font-medium">{formatPrice(server.price_per_hour)} UZS/soat</span>
          </p>
        </div>

        {/* Hours selection */}
        <div className="mb-6">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Clock className="h-4 w-4" />
            Necha soat?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {HOUR_OPTIONS.map((h) => (
              <button
                key={h}
                onClick={() => setHours(h)}
                className={cn(
                  'rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all',
                  hours === h
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border-subtle text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {h} soat
              </button>
            ))}
          </div>
        </div>

        {/* Price summary */}
        <div className="mb-6 rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Jami narx:</span>
            <span className="font-heading text-2xl font-bold text-primary">
              {formatPrice(totalPrice)} UZS
            </span>
          </div>
          {user && (
            <div className="mt-2 flex items-center justify-between border-t border-border-subtle pt-2">
              <span className="text-xs text-muted-foreground">Balansingiz:</span>
              <span className={cn('text-sm font-medium', hasBalance ? 'text-online' : 'text-offline')}>
                {formatPrice(user.balance)} UZS
              </span>
            </div>
          )}
        </div>

        {/* Balance warning */}
        {user && !hasBalance && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Balansingiz yetarli emas. Balansni to&apos;ldiring.
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !hasBalance || !user}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-shadow hover:glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Yaratilmoqda...' : 'Buyurtma berish'}
        </button>
      </div>
    </div>
  )
}
