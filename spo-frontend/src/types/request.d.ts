import type { Keyword } from './keyword'

export interface Request {
  id?: number
  title: string
  thumbnailUrl?: string | null
}
export interface RequestDetail {
  id: number
  userId: number
  title: string
  thumbnailUrl: string
  keywords: Keyword[]
}
