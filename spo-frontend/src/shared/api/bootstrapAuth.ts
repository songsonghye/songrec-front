// 새로고침 시 로그인 유지 (refresh)
import axios from 'axios'
import { refresh } from '../../features/auth/api/authApi'
import { useAuthStore } from '../auth/authStore'

let bootPromise: Promise<boolean> | null = null

export async function bootstrapAuth() {
  if (bootPromise) return bootPromise

  bootPromise = (async () => {
    try {
      await refresh()
      return true
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        useAuthStore.getState().clearSession()
        return false
      }
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        return useAuthStore.getState().isAuthenticated
      }
      console.error(e)
      useAuthStore.getState().clearSession()
      return false
    }
  })()
  return bootPromise
}
