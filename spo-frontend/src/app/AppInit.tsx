import { useEffect, useState } from 'react'
import { installInterceptors } from '../shared/api/interceptors'
import { bootstrapAuth } from '../shared/api/bootstrapAuth'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

export default function AppInit() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    installInterceptors()
    bootstrapAuth().finally(() => setReady(true))
  }, [])

  if (!ready) return <div>Loading...</div>
  return <RouterProvider router={router} />
}
