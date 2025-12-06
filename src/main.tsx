import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Core } from '@ag.ds-next/react/core'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Core>
      <App />
    </Core>
  </StrictMode>,
)
