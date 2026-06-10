import type {
  GameServer,
  LeaderboardEntry,
  Order,
  ServerMode,
  User,
} from './types'

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

const LOCATIONS = [
  { name: 'Tashkent', flag: '🇺🇿' },
  { name: 'Almaty', flag: '🇰🇿' },
  { name: 'Moscow', flag: '🇷🇺' },
  { name: 'Frankfurt', flag: '🇩🇪' },
]

const MODES: ServerMode[] = [
  '5X5',
  'DM',
  'RETAKE',
  'BHOP',
  'SURF',
  'KZ',
  'AWP',
  '2X2',
  'PISTOL',
  'ARENA',
  'HNS',
  'DEATHRUN',
]

function seeded(n: number) {
  // deterministic pseudo-random so server/client render match
  const x = Math.sin(n * 99.13) * 10000
  return x - Math.floor(x)
}

export const MOCK_SERVERS: GameServer[] = Array.from({ length: 24 }, (_, i) => {
  const mode = MODES[i % MODES.length]
  const max = mode === '2X2' ? 4 : mode === '5X5' ? 10 : mode === 'RETAKE' ? 10 : 24
  const online = seeded(i + 1) > 0.18
  const players = online ? Math.floor(seeded(i + 3) * (max + 1)) : 0
  const loc = LOCATIONS[i % LOCATIONS.length]
  return {
    id: i + 1,
    number: 200 + i,
    name: mode,
    mode,
    map: MAPS[i % MAPS.length],
    players,
    maxPlayers: max,
    status: online ? 'online' : 'offline',
    ip: `185.${100 + (i % 50)}.${i % 255}.${10 + i}:2701${i % 10}`,
    location: loc.name,
    locationFlag: loc.flag,
    ping: 8 + Math.floor(seeded(i + 7) * 35),
    locked: seeded(i + 11) > 0.82,
    premium: seeded(i + 13) > 0.78,
    image: `/abstract-geometric-shapes.png?height=250&width=400&query=${encodeURIComponent(
      'counter strike ' + MAPS[i % MAPS.length] + ' map screenshot dark',
    )}`,
  }
})

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
    return {
      rank: i + 1,
      username: i < NAMES.length ? NAMES[i] : `Player_${1000 + i}`,
      avatar: `/diverse-gaming-avatars.png?height=40&width=40&query=${encodeURIComponent(
        'gaming avatar neon ' + i,
      )}`,
      rating: Math.max(rating, 800),
      kd: Math.round((2.5 - i * 0.03 + seeded(i + 2) * 0.2) * 100) / 100,
      wins: Math.max(260 - i * 5 - Math.floor(seeded(i) * 10), 12),
      kills: Math.max(13000 - i * 240 - Math.floor(seeded(i + 1) * 300), 200),
      hours: Math.max(480 - i * 9, 14),
    }
  },
)

export const MOCK_USER: User = {
  id: 1,
  username: 'Sardor_47',
  email: 'sardor@upg.uz',
  avatar: `/single-gaming-avatar.jpg?height=120&width=120&query=esports player avatar neon pink`,
  balance: 125000,
  premium: true,
  steamId: 'STEAM_1:0:42857193',
  joinDate: '2024-03-15',
  stats: {
    kd: 1.98,
    wins: 198,
    losses: 142,
    hsPercent: 54,
    playtime: 380,
    rating: 2180,
    kills: 10200,
  },
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    serverName: '5X5 #212',
    mode: '5X5',
    hours: 24,
    price: 48000,
    date: '2025-05-28',
    status: 'active',
  },
  {
    id: 2,
    serverName: 'RETAKE #207',
    mode: 'RETAKE',
    hours: 12,
    price: 18000,
    date: '2025-05-20',
    status: 'active',
  },
  {
    id: 3,
    serverName: 'AWP #214',
    mode: 'AWP',
    hours: 6,
    price: 9000,
    date: '2025-04-30',
    status: 'expired',
  },
  {
    id: 4,
    serverName: 'DM #201',
    mode: 'DM',
    hours: 48,
    price: 72000,
    date: '2025-04-12',
    status: 'expired',
  },
]

export const MODE_TABS: { label: string; count: number }[] = MODES.map(
  (m) => ({
    label: m,
    count: MOCK_SERVERS.filter((s) => s.mode === m && s.status === 'online')
      .length,
  }),
)
