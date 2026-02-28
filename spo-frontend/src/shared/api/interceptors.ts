// 토큰 자동 첨부 + 401이면 refresh 후 재시도

import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../auth/authStore'
import { api } from './client'
import { refresh } from '../../features/auth/api/authApi'

let installed = false
let isRefreshing = false
// refresh 끝나면 실행할 작업들 모아둠
let queue: Array<(token: string | null) => void> = []

// queue에 저장된 함수들 전부 실행
function flushQueue(token: string | null) {
  queue.forEach((cb) => cb(token))
  queue = []
}

export function installInterceptors() {
  if (installed) return
  installed = true
  // 요청 전에 accessToken 자동 첨부
  api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // 응답에서 401 뜨면 refresh -> 요청 재시도
  api.interceptors.response.use(
    // 성공이면 그대로 통과
    (res) => res,

    // 실패하면 직접 제어
    async (err: AxiosError) => {
      const status = err.response?.status
      // 실패한 요청을 original에 저장했다가 나중에 다시 보냄
      const original = err.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      if (status !== 401 || !original || original._retry) {
        return Promise.reject(err)
      }

      const token = useAuthStore.getState().accessToken
      if (!token) return Promise.reject(err)

      original._retry = true

      // refresh 진행 중이면 큐에서 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((newToken) => {
            if (!newToken) return reject(err)
            original.headers = original.headers ?? {}
            original.headers.Authorization = `Bearer ${newToken}`
            resolve(api(original))
          })
        })
      }

      isRefreshing = true
      try {
        const newToken = await refresh()
        flushQueue(newToken)

        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshErr) {
        flushQueue(null)
        useAuthStore.getState().clearSession()
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }
  )
}
