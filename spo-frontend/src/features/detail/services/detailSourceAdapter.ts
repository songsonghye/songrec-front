import type { Detail } from '../../../page/PlaylistDetailPage'
import type { Playlist } from '../../../types/playlist'
import type { RequestDetail } from '../../../types/request'
import type { Search } from '../../../types/search'
import type { Track } from '../../../types/track'
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
  getTracks(id: number): Promise<Track[]>
  uploadThumbnail(id: number, file: File): Promise<void>
  updateTitle(id: number, title: string): Promise<void>
  deleteTrack(id: number, trackId: number): Promise<void>
  addTrack(id: number, track: Search['items'][number]): Promise<void>
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
        return res.data
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
          spotifyId: track.trackId,
          name: track.name,
          artist: track.artists.at(0)?.name,
          album: track.album.albumId,
          imageUrl: track.album.albumImages.at(0)?.url,
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
      return res.data
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
        spotifyId: track.trackId,
        name: track.name,
        artist: track.artists.at(0)?.name,
        album: track.album.albumId,
        imageUrl: track.album.albumImages.at(0)?.url,
        durationMs: track.durationMs,
      })
    },
  }
}
