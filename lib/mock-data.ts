import type { GameServer, LeaderboardEntry, Order, User } from './types'

/* ─── Maps ───────────────────────────────────────────────────────────────── */

const MAPS = [
  'de_dust2',
  'de_mirage',
  'de_inferno',
  'de_nuke',
  'de_overpass',
  'de_ancient',
  'de_vertigo',
  'de_anubis',
  'cs_office',
  'aim_redline',
]

/* ─── Categories ─────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { id: 1, name: '5X5', slug: 'competitive', icon: '⚔️', server_count: 6 },
  { id: 2, name: 'DM', slug: 'deathmatch', icon: '💀', server_count: 4 },
  { id: 3, name: 'RETAKE', slug: 'retake', icon: '🎯', server_count: 3 },
  { id: 4, name: 'AWP', slug: 'awp', icon: '🔫', server_count: 2 },
  { id: 5, name: 'SURF', slug: 'surf', icon: '🏄', server_count: 2 },
  { id: 6, name: 'BHOP', slug: 'bhop', icon: '🐰', server_count: 2 },
  { id: 7, name: 'KZ', slug: 'kz', icon: '🧗', server_count: 1 },
  { id: 8, name: '2X2', slug: '2x2', icon: '👥', server_count: 2 },
  { id: 9, name: 'ARENA', slug: 'arena', icon: '🏟️', server_count: 1 },
  { id: 10, name: 'HNS', slug: 'hns', icon: '🏃', server_count: 1 },
]

/* ─── Deterministic pseudo-random ────────────────────────────────────────── */

function seeded(n: number) {
  const x = Math.sin(n * 99.13) * 10000
  return x - Math.floor(x)
}

/* ─── Mock Servers ───────────────────────────────────────────────────────── */

export const MOCK_SERVERS: GameServer[] = Array.from({ length: 24 }, (_, i) => {
  const cat = CATEGORIES[i % CATEGORIES.length]
  const maxPlayers = cat.slug === '2x2' ? 4 : cat.slug === 'competitive' ? 10 : 24
  const isOnline = seeded(i + 1) > 0.15
  const currentPlayers = isOnline ? Math.floor(seeded(i + 3) * (maxPlayers + 1)) : 0
  const status: GameServer['status'] = isOnline ? 'online' : 'offline'

  return {
    id: i + 1,
    name: `${cat.name} #${200 + i}`,
    description: `${cat.name} rejimidagi server`,
    ip_address: `185.${100 + (i % 50)}.${i % 255}.${10 + i}`,
    port: 27015 + (i % 10),
    category: cat,
    map_name: MAPS[i % MAPS.length],
    max_players: maxPlayers,
    current_players: currentPlayers,
    status,
    is_premium: seeded(i + 13) > 0.78,
    price_per_hour: Math.round((1500 + seeded(i + 5) * 3500) / 100) * 100,
    connect_url: `steam://connect/185.${100 + (i % 50)}.${i % 255}.${10 + i}:${27015 + (i % 10)}`,
    player_percentage: maxPlayers > 0 ? Math.round((currentPlayers / maxPlayers) * 100) : 0,
    created_at: '2024-06-01T12:00:00Z',
  }
})

/* ─── Mock Leaderboard ───────────────────────────────────────────────────── */

const NAMES = [
  'xANTERIORx',
  'Sardor_47',
  'NiKoUZ',
  'b1t_tashkent',
  'ShadowAim',
  'Akmal_HS',
  'frozenUZ',
  'dEVilSpawn',
  'JaloliddinKZ',
  'no_scope_99',
  'TashkentTiger',
  'Mr_Headshot',
  'Bekzod_pro',
  'silentWolf',
  'Otabek_27',
  'crYZ',
  'Dilshod_AWP',
  'ghost_uz',
  'Rustam_5x5',
  'phantomUZ',
]

export const MOCK_LEADERBOARD: LeaderboardEntry[] = Array.from(
  { length: 50 },
  (_, i) => {
    const rating = Math.round((2600 - i * 38 - seeded(i) * 20) * 10) / 10
    const kills = Math.max(13000 - i * 240 - Math.floor(seeded(i + 1) * 300), 200)
    const deaths = Math.max(Math.floor(kills / (2.5 - i * 0.03 + seeded(i + 2) * 0.2)), 100)
    return {
      username: i < NAMES.length ? NAMES[i] : `Player_${1000 + i}`,
      avatar: null,
      steam_url: null,
      is_premium: seeded(i + 7) > 0.7,
      kills,
      deaths,
      assists: Math.floor(kills * 0.3),
      wins: Math.max(260 - i * 5 - Math.floor(seeded(i) * 10), 12),
      losses: Math.max(140 - i * 2, 20),
      headshot_percentage: Math.round((40 + seeded(i + 4) * 25) * 10) / 10,
      play_time_hours: Math.max(480 - i * 9, 14),
      rating: Math.max(rating, 800),
      kd_ratio: deaths > 0 ? Math.round((kills / deaths) * 100) / 100 : kills,
    }
  },
)

/* ─── Mock User ──────────────────────────────────────────────────────────── */

export const MOCK_USER: User = {
  id: 1,
  username: 'Sardor_47',
  email: 'sardor@upg.uz',
  avatar: null,
  steam_id: '76561198045120564',
  steam_url: 'https://steamcommunity.com/id/sardor47/',
  balance: 125000,
  is_premium: true,
  created_at: '2024-03-15T10:00:00Z',
}

/* ─── Mock Orders ────────────────────────────────────────────────────────── */

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    server: MOCK_SERVERS[0],
    status: 'active',
    status_display: 'Faol',
    hours: 24,
    total_price: 48000,
    started_at: '2025-05-28T10:00:00Z',
    expires_at: '2025-05-29T10:00:00Z',
    created_at: '2025-05-28T10:00:00Z',
    is_expired: false,
  },
  {
    id: 2,
    server: MOCK_SERVERS[2],
    status: 'active',
    status_display: 'Faol',
    hours: 12,
    total_price: 18000,
    started_at: '2025-05-20T14:00:00Z',
    expires_at: '2025-05-21T02:00:00Z',
    created_at: '2025-05-20T14:00:00Z',
    is_expired: false,
  },
  {
    id: 3,
    server: MOCK_SERVERS[6],
    status: 'expired',
    status_display: 'Muddati tugagan',
    hours: 6,
    total_price: 9000,
    started_at: '2025-04-30T08:00:00Z',
    expires_at: '2025-04-30T14:00:00Z',
    created_at: '2025-04-30T08:00:00Z',
    is_expired: true,
  },
  {
    id: 4,
    server: MOCK_SERVERS[1],
    status: 'expired',
    status_display: 'Muddati tugagan',
    hours: 48,
    total_price: 72000,
    started_at: '2025-04-12T06:00:00Z',
    expires_at: '2025-04-14T06:00:00Z',
    created_at: '2025-04-12T06:00:00Z',
    is_expired: true,
  },
]
