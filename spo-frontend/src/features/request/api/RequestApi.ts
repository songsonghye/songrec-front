import { api } from '../../../shared/api/client'
import type { TrackCreateRequestDto } from '../../../types/track'

//get
export async function getAllRequests() {
  try {
    const requests = await api.get(`/requests/feed`)
    return requests
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getMyRequests() {
  try {
    const requests = await api.get(`/requests/me`)
    return requests
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getMyRequestDetails(requestId: number) {
  try {
    const details = await api.get(`/requests/me/${requestId}`)
    return details
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getRequestFeedDetails(requestId: number) {
  try {
    const details = await api.get(`/requests/${requestId}`)
    return details
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getRequestTracks(requestId: number) {
  try {
    const tracks = await api.get(`/requests/${requestId}/tracks`)
    return tracks
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

//post
export async function addRequest(title: string) {
  try {
    const data = { title }
    const response = await api.post(`/requests`, data)
    return response
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export function uploadRequestThumbnail(requestId: number, file: File) {
  const form = new FormData()
  form.append('file', file)

  return api.post(`/requests/${requestId}/thumbnail`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function addTrackToRequest(
  requestId: number,
  dto: TrackCreateRequestDto
) {
  try {
    const response = await api.post(`/requests/${requestId}/tracks`, dto)
    return response
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

//delete
export async function deleteRequest(requestId: number) {
  try {
    const res = await api.delete(`/requests/${requestId}`)
    console.log(res)
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function deleteTrackByRequest(requestId: number, trackId: number) {
  try {
    const res = await api.delete(`/requests/${requestId}/tracks/${trackId}`)
    console.log(res)
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

//patch
export async function updateRequestTitle(requestId: number, title: string) {
  try {
    const data = { title }
    const res = await api.patch(`/requests/${requestId}`, data)
    return res
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}
