import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

async function startApplication() {
  if (import.meta.env.VITE_USE_MOCK_API !== 'false') {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void startApplication()
