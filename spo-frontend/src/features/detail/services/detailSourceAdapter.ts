import type { Detail } from '../../../page/PlaylistDetailPage'
import type { Playlist } from '../../../types/playlist'
import type { RequestDetail } from '../../../types/request'
import type { MyTrack } from '../../../types/search'
import type { SpotifyTrack, Track } from '../../../types/track'
import {
  addTrackToPlaylist,
  deleteTrackByPlaylist,
  getPlaylistDetails,
  getPlaylistTracks,
  updatePlaylistTitle,
  uploadPlaylistThumbnail,
} from '../../playlists/api/PlaylistApi'
import {
  addTrackToRequest,
  deleteTrackByRequest,
  getRequestFeedDetails,
  getRequestTracks,
  updateRequestTitle,
  uploadRequestThumbnail,
} from '../../request/api/RequestApi'

export interface DetailSourceAdapter {
  getDetail(id: number): Promise<Detail>
  getTracks(id: number): Promise<Track>
  uploadThumbnail(id: number, file: File): Promise<void>
  updateTitle(id: number, title: string): Promise<void>
  deleteTrack(id: number, trackId: number): Promise<void>
  addTrack(id: number, track: SpotifyTrack): Promise<void>
}

export function createDetailSourceAdapter(source: string): DetailSourceAdapter {
  if (source === 'request') {
    return {
      async getDetail(id) {
        const res = (await getRequestFeedDetails(id)).data as RequestDetail
        return {
          userId: res.userId,
          username: res.username,
          title: res.title,
          thumbnailUrl: res.thumbnailUrl ?? null,
          visibility: 'PUBLIC',
        }
      },
      async getTracks(id) {
        const res = await getRequestTracks(id)
        const mapped: Track = {
          tracks: (res.data as MyTrack[]).map((t) => ({
            track: {
              trackId: t.trackId,
              spotifyId: t.spotifyTrack.spotifyId,
              name: t.spotifyTrack.name,
              artistName: t.spotifyTrack.artistName,
              album: t.spotifyTrack.album,
              imageUrl: t.spotifyTrack.imageUrl,
              durationMs: t.spotifyTrack.durationMs,
              liked: t.spotifyTrack.liked,
            },
          })),
        }
        return mapped
      },
      async uploadThumbnail(id, file) {
        await uploadRequestThumbnail(id, file)
      },
      async updateTitle(id, title) {
        await updateRequestTitle(id, title)
      },
      async deleteTrack(id, trackId) {
        await deleteTrackByRequest(id, trackId)
      },
      async addTrack(id, track) {
        await addTrackToRequest(id, {
          spotifyId: track.spotifyId,
          name: track.name,
          artist: track.artistName,
          album: track.album,
          imageUrl: track.imageUrl,
          durationMs: track.durationMs,
        })
      },
    }
  }
  return {
    async getDetail(id) {
      const res = (await getPlaylistDetails(id)).data as Playlist
      return {
        userId: res.userId,
        username: res.username,
        title: res.title,
        thumbnailUrl: res.thumbnailUrl ?? null,
        visibility: res.visibility,
      }
    },
    async getTracks(id) {
      const res = await getPlaylistTracks(id)
      const mapped: Track = {
        tracks: (res.data as MyTrack[]).map((t) => ({
          track: {
            trackId: t.trackId,
            spotifyId: t.spotifyTrack.spotifyId,
            name: t.spotifyTrack.name,
            artistName: t.spotifyTrack.artistName,
            album: t.spotifyTrack.album,
            imageUrl: t.spotifyTrack.imageUrl,
            durationMs: t.spotifyTrack.durationMs,
            liked: t.spotifyTrack.liked,
          },
        })),
      }
      return mapped
    },
    async uploadThumbnail(id, file) {
      await uploadPlaylistThumbnail(id, file)
    },
    async updateTitle(id, title) {
      await updatePlaylistTitle(id, title)
    },
    async deleteTrack(id, trackId) {
      await deleteTrackByPlaylist(id, trackId)
    },
    async addTrack(id, track) {
      await addTrackToPlaylist(id, {
        spotifyId: track.spotifyId,
        name: track.name,
        artist: track.artistName,
        album: track.album,
        imageUrl: track.imageUrl,
        durationMs: track.durationMs,
      })
    },
  }
}
