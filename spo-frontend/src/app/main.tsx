import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppInit from './AppInit'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppInit />
  </StrictMode>
)
