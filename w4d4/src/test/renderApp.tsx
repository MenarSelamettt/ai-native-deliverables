import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { MemoryRouter, useRoutes } from 'react-router-dom'
import { createAppQueryClient } from '../app/queryClient'
import { appRoutes } from '../app/routes'

function TestRoutes() {
  return useRoutes(appRoutes)
}

export function renderApp(initialPath = '/dashboard') {
  const queryClient = createAppQueryClient()
  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <TestRoutes />
      </MemoryRouter>
    </QueryClientProvider>,
  )

  return { ...result, queryClient }
}
