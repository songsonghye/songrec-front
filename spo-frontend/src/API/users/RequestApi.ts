import { api } from '../APIHandler'

export async function getRequests(userId: number) {
  try {
    const requests = await api.get(`/users/${userId}/requests`)
    return requests
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function getRequestDetails(userId: number, requestId: number) {
  try {
    const details = await api.get(`/users/${userId}/requests/${requestId}`)
    return details
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export async function addRequest(userId: number, title: string) {
  try {
    const data = { title }
    const response = await api.post(`/users/${userId}/requests`, data)
    return response
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}

export function uploadRequestThumbnail(
  userId: number,
  requestId: number,
  file: File
) {
  const form = new FormData()
  form.append('file', file)

  return api.post(`/users/${userId}/requests/${requestId}/thumbnail`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export async function getRequestTracks(userId: number, requestId: number) {
  try {
    const tracks = await api.get(
      `/users/${userId}/requests/${requestId}/tracks`
    )
    return tracks
  } catch (error) {
    console.error('Error: ' + error)
    throw error
  }
}
