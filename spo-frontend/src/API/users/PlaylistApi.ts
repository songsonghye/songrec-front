import { api } from '../APIHandler'

export async function getPlaylists(userId: number) {
  try {
    const playlists = await api.get(`/users/${userId}/playlists`)
    return playlists
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getPlaylistDetails(userId: number, playlistId: number) {
  try {
    const details = await api.get(`/users/${userId}/playlists/${playlistId}`)
    return details
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function addPlaylist(userId: number, title: string) {
  try {
    const data = { title }
    const response = await api.post(`/users/${userId}/playlists`, data)
    return response
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getPlaylistTracks(userId: number, playlistId: number) {
  try {
    const tracks = await api.get(
      `/users/${userId}/playlists/${playlistId}/tracks`
    )
    return tracks
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}
