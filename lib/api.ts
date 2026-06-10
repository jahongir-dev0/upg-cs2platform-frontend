'use client'

import type {
  AuthTokens,
  GameServer,
  LeaderboardEntry,
  Order,
  ServerCategory,
  ServerStats,
  User,
} from './types'
import { MOCK_LEADERBOARD, MOCK_ORDERS, MOCK_SERVERS, MOCK_USER } from './mock-data'

/* ─── Config ─────────────────────────────────────────────────────────────── */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API = `${API_BASE}/api`
const ACCESS_KEY = 'upg_access'
const REFRESH_KEY = 'upg_refresh'
const TIMEOUT = 5000

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
        // Retry with new token
        const retryRes = await fetch(`${API}${path}`, {
          ...options,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenStore.getAccess()}`,
            ...options.headers,
          },
        })
        if (!retryRes.ok) throw new Error(`HTTP ${retryRes.status}`)
        return (await retryRes.json()) as T
      }
      tokenStore.clear()
      throw new Error('Session expired')
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
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

/* ─── Mock delay helper ──────────────────────────────────────────────────── */

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/* ─── API Interface ──────────────────────────────────────────────────────── */

export interface ServerFilters {
  category?: string
  status?: string
  search?: string
  is_premium?: boolean
  ordering?: string
}

export const api = {
  /* ── Steam Auth ── */

  /**
   * Steam orqali login qilish uchun backend URL ni qaytaradi.
   * Frontend bu URL ga redirect qiladi.
   */
  getSteamLoginUrl(): string {
    return `${API_BASE}/auth/login/steam/`
  },

  /**
   * Steam callback muvaffaqiyatli bo'lgandan keyin
   * session'dan JWT token oladi.
   */
  async exchangeSteamToken(): Promise<AuthTokens> {
    const res = await fetch(`${API}/auth/steam/token/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`Steam token exchange failed: ${res.status}`)
    const data: AuthTokens = await res.json()
    tokenStore.set(data.access, data.refresh)
    return data
  },

  /**
   * Joriy foydalanuvchi ma'lumotlarini oladi.
   */
  async getMe(): Promise<User> {
    try {
      return await request<User>('/auth/me/')
    } catch {
      return delay(MOCK_USER)
    }
  },

  /**
   * Profil ma'lumotlarini oladi.
   */
  async getProfile(): Promise<User> {
    try {
      return await request<User>('/auth/profile/')
    } catch {
      return delay(MOCK_USER)
    }
  },

  /**
   * Profil ma'lumotlarini yangilaydi (faqat username).
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    return request<User>('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  /**
   * Logout — refresh token blacklist qilinadi.
   */
  async logout(): Promise<void> {
    const refresh = tokenStore.getRefresh()
    if (refresh) {
      try {
        await request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh }),
        })
      } catch {
        // Token allaqachon yaroqsiz bo'lishi mumkin
      }
    }
    tokenStore.clear()
  },

  /* ── Servers ── */

  async getServers(filters: ServerFilters = {}): Promise<GameServer[]> {
    try {
      const params = new URLSearchParams()
      if (filters.category) params.set('category', filters.category)
      if (filters.status && filters.status !== 'all') params.set('status', filters.status)
      if (filters.search) params.set('search', filters.search)
      if (filters.is_premium !== undefined) params.set('is_premium', String(filters.is_premium))
      if (filters.ordering) params.set('ordering', filters.ordering)
      const query = params.toString()
      const url = `/servers/${query ? `?${query}` : ''}`
      const data = await request<{ results?: GameServer[] } | GameServer[]>(url)
      // DRF pagination yoki oddiy list
      return Array.isArray(data) ? data : (data.results || [])
    } catch {
      return delay(MOCK_SERVERS)
    }
  },

  async getServerDetail(id: number): Promise<GameServer> {
    return request<GameServer>(`/servers/${id}/`)
  },

  async getServerCategories(): Promise<ServerCategory[]> {
    try {
      return await request<ServerCategory[]>('/servers/categories/')
    } catch {
      return delay([])
    }
  },

  async getServerStats(): Promise<ServerStats> {
    try {
      return await request<ServerStats>('/servers/stats/')
    } catch {
      return delay({
        total_servers: 24,
        online_servers: 20,
        offline_servers: 4,
        total_players: 247,
        max_capacity: 480,
        fill_percentage: 51.5,
      })
    }
  },

  /* ── Leaderboard ── */

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const data = await request<{ results?: LeaderboardEntry[] } | LeaderboardEntry[]>(
        '/leaderboard/',
      )
      return Array.isArray(data) ? data : (data.results || [])
    } catch {
      return delay(MOCK_LEADERBOARD)
    }
  },

  /* ── Orders ── */

  async getOrders(): Promise<Order[]> {
    try {
      const data = await request<{ results?: Order[] } | Order[]>('/orders/')
      return Array.isArray(data) ? data : (data.results || [])
    } catch {
      return delay(MOCK_ORDERS)
    }
  },

  async getActiveOrders(): Promise<Order[]> {
    try {
      return await request<Order[]>('/orders/active/')
    } catch {
      return delay([])
    }
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
}
