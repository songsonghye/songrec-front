// Access Token 저장소
import { create } from 'zustand'
import type { LoginResponseDto } from '../../types/auth'

interface AuthState {
  userId: number | null
  email: string | null
  username: string | null
  role: string | null
  accessToken: string | null
  isAuthenticated: boolean

  setSession: (p: LoginResponseDto) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  username: null,
  role: null,
  accessToken: null,
  isAuthenticated: false,

  setSession: ({ userId, email, username, role, accessToken }) => {
    set({ userId, email, username, role, accessToken, isAuthenticated: true })
  },
  clearSession: () =>
    set({
      userId: null,
      email: null,
      username: null,
      role: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}))
