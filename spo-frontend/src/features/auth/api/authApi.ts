// login/ refresh/ logout API 모듈

import { authApi } from '../../../shared/api/client'
import { useAuthStore } from '../../../shared/auth/authStore'
import type { LoginResponseDto } from '../../../types/auth'

export async function login(email: string, password: string) {
  const res = await authApi.post<LoginResponseDto>('/auth/login', {
    email,
    password,
  })
  useAuthStore.getState().setSession(res.data)
  return res.data
}

export async function refresh() {
  const res = await authApi.post<LoginResponseDto>('/auth/refresh')
  useAuthStore.getState().setSession(res.data)
  return res.data.accessToken
}

export async function logout() {
  await authApi.post('/auth/logout')
  useAuthStore.getState().clearSession()
}

export async function signup(
  email: string,
  username: string,
  password: string
) {
  await authApi.post('/auth/signup', {
    email,
    username,
    password,
  })
}
