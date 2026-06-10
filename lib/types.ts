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

export interface GameServer {
  id: number
  number: number
  name: string
  mode: ServerMode
  map: string
  players: number
  maxPlayers: number
  status: 'online' | 'offline'
  ip: string
  location: string
  locationFlag: string
  ping: number
  locked: boolean
  premium: boolean
  image: string
}

export interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string
  rating: number
  kd: number
  wins: number
  kills: number
  hours: number
}

export interface User {
  id: number
  username: string
  email: string
  avatar: string
  balance: number
  premium: boolean
  steamId: string
  joinDate: string
  stats: {
    kd: number
    wins: number
    losses: number
    hsPercent: number
    playtime: number
    rating: number
    kills: number
  }
}

export interface Order {
  id: number
  serverName: string
  mode: ServerMode
  hours: number
  price: number
  date: string
  status: 'active' | 'expired'
}

export interface AuthTokens {
  user: User
  access: string
  refresh: string
}
