'use client'

import type {
  AuthTokens,
  GameServer,
  LeaderboardEntry,
  Order,
  User,
} from './types'
import {
  MOCK_LEADERBOARD,
  MOCK_ORDERS,
  MOCK_SERVERS,
  MOCK_USER,
} from './mock-data'

const API = 'http://localhost:8000/api'
const ACCESS_KEY = 'upg_access'
const REFRESH_KEY = 'upg_refresh'
const TIMEOUT = 2500

export const tokenStore = {
  getAccess: () =>
    typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null,
  getRefresh: () =>
    typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null,
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)
  const access = tokenStore.getAccess()
  try {
    const res = await fetch(`${API}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
        ...options.headers,
      },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export interface ServerFilters {
  category?: string
  status?: string
  search?: string
  location?: string
}

function applyFilters(list: GameServer[], f: ServerFilters): GameServer[] {
  let out = [...list]
  if (f.status && f.status !== 'all') {
    out = out.filter((s) => s.status === f.status)
  }
  if (f.location && f.location !== 'all') {
    out = out.filter((s) => s.location === f.location)
  }
  if (f.search) {
    const q = f.search.toLowerCase()
    out = out.filter(
      (s) =>
        s.map.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        String(s.number).includes(q),
    )
  }
  return out
}

export const api = {
  async getServers(filters: ServerFilters = {}): Promise<GameServer[]> {
    try {
      const params = new URLSearchParams()
      if (filters.category) params.set('category', filters.category)
      if (filters.status) params.set('status', filters.status)
      if (filters.search) params.set('search', filters.search)
      const data = await request<GameServer[]>(
        `/servers/?${params.toString()}`,
      )
      return applyFilters(data, filters)
    } catch {
      return delay(applyFilters(MOCK_SERVERS, filters))
    }
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      return await request<LeaderboardEntry[]>('/leaderboard/')
    } catch {
      return delay(MOCK_LEADERBOARD)
    }
  },

  async login(email: string, password: string): Promise<AuthTokens> {
    try {
      const data = await request<AuthTokens>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      tokenStore.set(data.access, data.refresh)
      return data
    } catch {
      // mock fallback
      const data: AuthTokens = {
        user: { ...MOCK_USER, email },
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      }
      tokenStore.set(data.access, data.refresh)
      return delay(data, 600)
    }
  },

  async register(
    username: string,
    email: string,
    password: string,
    password2: string,
  ): Promise<AuthTokens> {
    try {
      const data = await request<AuthTokens>('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, password2 }),
      })
      tokenStore.set(data.access, data.refresh)
      return data
    } catch {
      const data: AuthTokens = {
        user: {
          ...MOCK_USER,
          username,
          email,
          premium: false,
          balance: 0,
          stats: {
            kd: 0,
            wins: 0,
            losses: 0,
            hsPercent: 0,
            playtime: 0,
            rating: 1000,
            kills: 0,
          },
        },
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      }
      tokenStore.set(data.access, data.refresh)
      return delay(data, 600)
    }
  },

  async getProfile(): Promise<User> {
    try {
      return await request<User>('/auth/profile/')
    } catch {
      return delay(MOCK_USER)
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      return await request<Order[]>('/orders/')
    } catch {
      return delay(MOCK_ORDERS)
    }
  },

  logout() {
    tokenStore.clear()
  },
}
