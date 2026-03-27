import type { SpotifyTrack } from './track'

export interface MyTrack {
  trackId: number
  spotifyTrack: SpotifyTrack
}

export interface Artist {
  artistId?: string
  images?: Image[]
  name: string
}

export interface Image {
  url: string
}
