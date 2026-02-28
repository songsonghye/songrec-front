import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL

// 일반 api (Authorization 필요)
export const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
})

// 인증 전용 api
export const authApi = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
})
