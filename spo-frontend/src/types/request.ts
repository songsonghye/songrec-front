import type { Keyword } from './keyword'

export interface Request {
  id?: number
  title: string
  thumbnailUrl?: string | null
}
export interface RequestDetail {
  id: number
  userId: number
  username: string
  title: string
  thumbnailUrl?: string
  keywords: Keyword[]
}

export interface RequestFeedItem {
  id: number
  username?: string
  title: string
  thumbnailUrl?: string
  keywords?: string[]
  trackCount: number
  createdAt: string
}
