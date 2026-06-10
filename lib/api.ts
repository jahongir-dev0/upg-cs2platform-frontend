'use client'

import type {
  AuthTokens,
  FAQItem,
  GameServer,
  LeaderboardEntry,
  Order,
  Product,
  ProductCategory,
  Purchase,
  ServerCategory,
  ServerStats,
  SiteSettings,
  User,
} from './types'

/* ─── Config ─────────────────────────────────────────────────────────────── */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API = `${API_BASE}/api`
const ACCESS_KEY = 'upg_access'
const REFRESH_KEY = 'upg_refresh'
const TIMEOUT = 8000

/* ─── Token Store ────────────────────────────────────────────────────────── */

export const tokenStore = {
  getAccess: () =>
    typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null,
  getRefresh: () =>
    typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null,
  set(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

/* ─── HTTP helper ────────────────────────────────────────────────────────── */

class ApiError extends Error {
  status: number
  data: Record<string, unknown> | null

  constructor(message: string, status: number, data: Record<string, unknown> | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)
  const access = tokenStore.getAccess()

  try {
    const res = await fetch(`${API}${path}`, {
      ...options,
      signal: controller.signal,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
        ...options.headers,
      },
    })

    // Token expired — try refresh
    if (res.status === 401 && tokenStore.getRefresh()) {
      const refreshed = await refreshToken()
      if (refreshed) {
        const retryRes = await fetch(`${API}${path}`, {
          ...options,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenStore.getAccess()}`,
            ...options.headers,
          },
        })
        if (!retryRes.ok) {
          const errData = await retryRes.json().catch(() => null)
          throw new ApiError(`HTTP ${retryRes.status}`, retryRes.status, errData)
        }
        return (await retryRes.json()) as T
      }
      tokenStore.clear()
      throw new ApiError('Session expired', 401)
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => null)
      throw new ApiError(`HTTP ${res.status}`, res.status, errData)
    }
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokenStore.getRefresh() }),
    })
    if (!res.ok) return false
    const data = await res.json()
    tokenStore.set(data.access, data.refresh || tokenStore.getRefresh()!)
    return true
  } catch {
    return false
  }
}

/* ─── Paginated response helper ──────────────────────────────────────────── */

function extractResults<T>(data: { results?: T[] } | T[]): T[] {
  return Array.isArray(data) ? data : (data.results || [])
}

/* ─── API Interface ──────────────────────────────────────────────────────── */

export const api = {
  /* ── Site Settings ── */

  async getSiteSettings(): Promise<SiteSettings> {
    return request<SiteSettings>('/site/settings/')
  },

  async getFAQ(): Promise<FAQItem[]> {
    const data = await request<{ results?: FAQItem[] } | FAQItem[]>('/site/faq/')
    return extractResults(data)
  },

  /* ── Steam Auth ── */

  getSteamLoginUrl(): string {
    return `${API_BASE}/auth/login/steam/`
  },

  async exchangeSteamToken(): Promise<AuthTokens> {
    const res = await fetch(`${API}/auth/steam/token/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new ApiError(`Steam token exchange failed`, res.status)
    const data: AuthTokens = await res.json()
    tokenStore.set(data.access, data.refresh)
    return data
  },

  async getMe(): Promise<User> {
    return request<User>('/auth/me/')
  },

  async getProfile(): Promise<User> {
    return request<User>('/auth/profile/')
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    return request<User>('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async logout(): Promise<void> {
    const refresh = tokenStore.getRefresh()
    if (refresh) {
      try {
        await request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh }),
        })
      } catch {
        // Token allaqachon yaroqsiz
      }
    }
    tokenStore.clear()
  },

  /* ── Servers ── */

  async getServers(filters: Record<string, string> = {}): Promise<GameServer[]> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v && v !== 'all') params.set(k, v)
    })
    const query = params.toString()
    const data = await request<{ results?: GameServer[] } | GameServer[]>(
      `/servers/${query ? `?${query}` : ''}`
    )
    return extractResults(data)
  },

  async getServerDetail(id: number): Promise<GameServer> {
    return request<GameServer>(`/servers/${id}/`)
  },

  async getServerCategories(): Promise<ServerCategory[]> {
    return request<ServerCategory[]>('/servers/categories/')
  },

  async getServerStats(): Promise<ServerStats> {
    return request<ServerStats>('/servers/stats/')
  },

  /* ── Leaderboard ── */

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const data = await request<{ results?: LeaderboardEntry[] } | LeaderboardEntry[]>(
      '/leaderboard/'
    )
    return extractResults(data)
  },

  /* ── Orders ── */

  async getOrders(): Promise<Order[]> {
    const data = await request<{ results?: Order[] } | Order[]>('/orders/')
    return extractResults(data)
  },

  async getActiveOrders(): Promise<Order[]> {
    return request<Order[]>('/orders/active/')
  },

  async createOrder(serverId: number, hours: number): Promise<Order> {
    return request<Order>('/orders/create/', {
      method: 'POST',
      body: JSON.stringify({ server_id: serverId, hours }),
    })
  },

  async cancelOrder(orderId: number): Promise<{ detail: string }> {
    return request<{ detail: string }>(`/orders/${orderId}/cancel/`, {
      method: 'POST',
    })
  },

  /* ── Shop ── */

  async getProducts(filters: Record<string, string> = {}): Promise<Product[]> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    const query = params.toString()
    const data = await request<{ results?: Product[] } | Product[]>(
      `/shop/products/${query ? `?${query}` : ''}`
    )
    return extractResults(data)
  },

  async getProductDetail(slug: string): Promise<Product> {
    return request<Product>(`/shop/products/${slug}/`)
  },

  async getShopCategories(): Promise<ProductCategory[]> {
    return request<ProductCategory[]>('/shop/categories/')
  },

  async purchaseProduct(productId: number): Promise<Purchase> {
    return request<Purchase>('/shop/purchase/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    })
  },

  async getPurchaseHistory(): Promise<Purchase[]> {
    const data = await request<{ results?: Purchase[] } | Purchase[]>('/shop/purchases/')
    return extractResults(data)
  },
}
