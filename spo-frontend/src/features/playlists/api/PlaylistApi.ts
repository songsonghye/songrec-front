import { api } from '../../../shared/api/client'
import type { TrackCreateRequestDto } from '../../../types/track'

// get
export async function getMyPlaylists() {
  try {
    const playlists = await api.get(`/playlists`)
    return playlists
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getPublicPlaylists(page: number, size: number) {
  try {
    const params = { page, size }
    const playlists = await api.get(`/public/playlists`, { params })
    return playlists
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getPlaylistDetails(playlistId: number) {
  try {
    const details = await api.get(`/playlists/${playlistId}`)
    return details
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getPlaylistTracks(playlistId: number) {
  try {
    const tracks = await api.get(`/playlists/${playlistId}/tracks`)
    return tracks
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

//post
export async function addPlaylist(title: string) {
  try {
    const data = { title }
    const response = await api.post(`/playlists`, data)
    return response
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export function uploadPlaylistThumbnail(playlistId: number, file: File) {
  const form = new FormData()
  form.append('file', file)

  return api.post(`/playlists/${playlistId}/thumbnail`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function addTrackToPlaylist(
  playlistId: number,
  dto: TrackCreateRequestDto
) {
  try {
    const response = await api.post(`/playlists/${playlistId}/tracks`, dto)
    return response
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

// delete
export async function deletePlaylist(playlistId: number) {
  try {
    const res = await api.delete(`/playlists/${playlistId}`)
    console.log(res)
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function deleteTrackByPlaylist(
  playlistId: number,
  trackId: number
) {
  try {
    const res = await api.delete(`/playlists/${playlistId}/tracks/${trackId}`)
    console.log(res)
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

// patch
export async function updatePlaylistTitle(playlistId: number, title: string) {
  try {
    const data = { title }
    const res = await api.patch(`/playlists/${playlistId}`, data)
    return res
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function updatePlaylistVisibility(
  playlistId: number,
  visibility: string
) {
  try {
    const data = { visibility }
    const res = await api.patch(`/playlists/${playlistId}/visibility`, data)
    return res
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}
