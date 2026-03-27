export type Visibility = 'PRIVATE' | 'PUBLIC'

export interface Playlist {
  id: number
  userId: number
  username: string
  code?: string
  title: string
  thumbnailUrl?: string | null
  visibility: Visibility
}

export interface LikedPlaylist {
  playlistId: number
  username: string
  playlistTitle: string
  thumbnailUrl: string
  createdAt: string
}

export interface PublicPlaylist {
  playlists: PlaylistDetails[]
}

export interface PlaylistDetails {
  id: number
  userId: number
  username: string
  code?: string
  title: string
  thumbnailUrl?: string | null
  visibility: Visibility
  liked: boolean
}

export interface PopularPlaylist {
  id: number
  userId: number
  username: string
  title: string
  thumbnailUrl?: string | null
  visibility: Visibility
  likeCount: number
}
