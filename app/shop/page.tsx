'use client'

import { useEffect, useState } from 'react'
import { Crown, Check, AlertCircle, Loader2, Tag } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { SectionHeading } from '@/components/ui-bits'
import { useAuth, useToast } from '@/components/providers'
import { SteamLoginButton } from '@/components/steam-login-button'
import { api } from '@/lib/api'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

function formatPrice(n: number) {
  return new Intl.NumberFormat('uz-UZ').format(n)
}

function ProductCard({ product, onBuy }: { product: Product; onBuy: (p: Product) => void }) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border bg-card p-6 transition-all hover:border-primary/40 hover:glow-primary-soft',
        product.is_popular ? 'border-primary/50' : 'border-border',
      )}
    >
      {product.is_popular && (
        <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
          Mashhur
        </span>
      )}
      {product.discount_percentage > 0 && (
        <span className="absolute -top-3 right-4 rounded-full bg-online/90 px-3 py-1 text-[10px] font-bold text-white">
          -{product.discount_percentage}%
        </span>
      )}

      <div className="mb-4">
        <h3 className="font-heading text-lg font-bold uppercase text-foreground">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {product.short_description || product.description.slice(0, 100)}
        </p>
      </div>

      <div className="mb-4 flex items-baseline gap-2">
        <span className="font-heading text-3xl font-bold text-primary">
          {formatPrice(product.price)}
        </span>
        <span className="text-sm text-muted-foreground">UZS</span>
        {product.original_price && product.original_price > product.price && (
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(product.original_price)}
          </span>
        )}
      </div>

      {product.features.length > 0 && (
        <ul className="mb-6 flex flex-col gap-2">
          {product.features.map((f: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => onBuy(product)}
        className="mt-auto rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-shadow hover:glow-primary"
      >
        Sotib olish
      </button>
    </div>
  )
}

export default function ShopPage() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buying, setBuying] = useState<number | null>(null)

  useEffect(() => {
    api.getProducts()
      .then(setProducts)
      .catch(() => setError("Mahsulotlarni yuklashda xatolik yuz berdi."))
      .finally(() => setLoading(false))
  }, [])

  async function handleBuy(product: Product) {
    if (!user) {
      toast("Xarid qilish uchun tizimga kiring", 'error')
      return
    }
    if (buying) return

    setBuying(product.id)
    try {
      await api.purchaseProduct(product.id)
      toast(`"${product.name}" muvaffaqiyatli sotib olindi!`, 'success')
      await refreshUser()
    } catch (e: unknown) {
      const err = e as { data?: { detail?: string } }
      toast(err?.data?.detail || "Xarid amalga oshmadi", 'error')
    } finally {
      setBuying(null)
    }
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <SectionHeading>Do&apos;kon</SectionHeading>
          <p className="pl-5 text-sm text-muted-foreground">
            Premium obunalar, server ijarasi va boshqa xizmatlar
          </p>
        </div>

        {!user && (
          <div className="mb-8 flex items-center gap-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <Tag className="h-5 w-5 text-primary" />
            <p className="flex-1 text-sm text-muted-foreground">
              Xarid qilish uchun Steam orqali kiring
            </p>
            <SteamLoginButton size="sm" />
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-skeleton h-72 rounded-xl bg-surface" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-card py-16 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-foreground font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
            >
              Qayta urinish
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border-subtle bg-card py-16 text-center">
            <Crown className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              Hozircha mahsulotlar qo&apos;shilmagan. Tez kunda yangi takliflar paydo bo&apos;ladi!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} onBuy={handleBuy} />
            ))}
          </div>
        )}

        {buying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 rounded-lg bg-card px-6 py-4 shadow-xl">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-foreground">Xarid amalga oshirilmoqda...</span>
            </div>
          </div>
        )}
      </div>
    </SiteShell>
  )
}
