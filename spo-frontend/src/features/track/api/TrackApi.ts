import { api } from '../../../shared/api/client'
import type { TrackCreateRequestDto } from '../../../types/track'

export async function searchTrack(query: string) {
  try {
    const response = await api.get(`/tracks/search`, {
      params: { q: query },
    })
    return response
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function addTrackLike(dto: TrackCreateRequestDto) {
  try {
    const res = await api.post('/tracks/likes', dto)
    return res
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function deleteTrackLike(spotifyId: string) {
  try {
    const res = await api.delete(`/tracks/${spotifyId}/likes`)
    console.log(res)
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}
