/* ─── Server ─────────────────────────────────────────────────────────────── */

export type ServerMode =
  | '5X5'
  | 'DM'
  | 'RETAKE'
  | 'BHOP'
  | 'SURF'
  | 'KZ'
  | 'AWP'
  | '2X2'
  | 'PISTOL'
  | 'ARENA'
  | 'HNS'
  | 'DEATHRUN'

export interface ServerCategory {
  id: number
  name: string
  slug: string
  icon: string
  server_count: number
}

export interface GameServer {
  id: number
  name: string
  description: string
  ip_address: string
  port: number
  category: ServerCategory | null
  map_name: string
  max_players: number
  current_players: number
  status: 'online' | 'offline' | 'maintenance'
  is_premium: boolean
  price_per_hour: number
  connect_url: string
  player_percentage: number
  created_at: string
}

export interface ServerStats {
  total_servers: number
  online_servers: number
  offline_servers: number
  total_players: number
  max_capacity: number
  fill_percentage: number
}

/* ─── User ───────────────────────────────────────────────────────────────── */

export interface User {
  id: number
  username: string
  email: string | null
  avatar: string | null
  steam_id: string | null
  steam_url: string | null
  balance: number
  is_premium: boolean
  created_at: string
}

/* ─── Leaderboard ────────────────────────────────────────────────────────── */

export interface LeaderboardEntry {
  username: string
  avatar: string | null
  steam_url: string | null
  is_premium: boolean
  kills: number
  deaths: number
  assists: number
  wins: number
  losses: number
  headshot_percentage: number
  play_time_hours: number
  rating: number
  kd_ratio: number
}

/* ─── Orders ─────────────────────────────────────────────────────────────── */

export type OrderStatus = 'pending' | 'active' | 'expired' | 'cancelled'

export interface Order {
  id: number
  server: GameServer
  status: OrderStatus
  status_display: string
  hours: number
  total_price: number
  started_at: string | null
  expires_at: string | null
  created_at: string
  is_expired: boolean
}

/* ─── Auth ───────────────────────────────────────────────────────────────── */

export interface AuthTokens {
  access: string
  refresh: string
  user: User
}
