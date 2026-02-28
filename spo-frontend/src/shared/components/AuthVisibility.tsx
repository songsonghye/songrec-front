import type { ReactNode } from 'react'
import { useAuthStore } from '../auth/authStore'

export function AuthOnly({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return null
  return <>{children}</>
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return null
  return <>{children}</>
}
