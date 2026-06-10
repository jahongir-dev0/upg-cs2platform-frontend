/* ─── Site Settings ───────────────────────────────────────────────────────── */

export interface SiteSettings {
  site_name: string
  site_description: string
  site_tagline: string
  hero_title: string
  hero_subtitle: string
  hero_cta_text: string
  display_ping: number
  display_player_count: number
  display_modes_count: number
  discord_url: string | null
  telegram_url: string | null
  youtube_url: string | null
  steam_group_url: string | null
  support_email: string
  support_telegram: string
  address: string
}

/* ─── Server ─────────────────────────────────────────────────────────────── */

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

/* ─── Shop ───────────────────────────────────────────────────────────────── */

export interface ProductCategory {
  id: number
  name: string
  slug: string
  icon: string
  product_count: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  short_description: string
  category: ProductCategory | null
  product_type: 'subscription' | 'server_rental' | 'balance' | 'skin' | 'other'
  price: number
  original_price: number | null
  duration: string
  features: string[]
  image: string | null
  is_popular: boolean
  discount_percentage: number
  created_at: string
}

export interface Purchase {
  id: number
  product: Product
  status: string
  status_display: string
  amount: number
  created_at: string
  completed_at: string | null
}

/* ─── Help ───────────────────────────────────────────────────────────────── */

export interface FAQItem {
  id: number
  question: string
  answer: string
  icon: string
  order: number
}

/* ─── Auth ───────────────────────────────────────────────────────────────── */

export interface AuthTokens {
  access: string
  refresh: string
  user: User
}
