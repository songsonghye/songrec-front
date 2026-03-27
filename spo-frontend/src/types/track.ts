import type { Artist } from './search'

export interface Track {
  tracks: TrackDetails[]
}

export interface TrackDetails {
  track: SpotifyTrack
  artist?: Artist
}

export interface SpotifyTrack {
  trackId?: number
  spotifyId: string
  name: string
  artistName: string
  album: string
  imageUrl: string
  durationMs: number
  liked: boolean
}

export interface TrackCreateRequestDto {
  spotifyId: string
  name: string
  artist?: string
  album: string
  imageUrl?: string
  durationMs: number
}

export interface LikedTrackItem {
  trackId: number
  name: string
  artist: string
  album: string
  imageUrl: string
  createdAt: string
}
