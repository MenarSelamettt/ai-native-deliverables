import { afterAll, afterEach, beforeAll } from 'vitest'
import { resetMockApiState } from '../mocks/handlers'
import { server } from '../mocks/server'

const platformFetch = globalThis.fetch

beforeAll(() => {
  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const request = typeof input === 'string' && input.startsWith('/')
      ? new URL(input, 'http://localhost')
      : input

    return platformFetch(request, init)
  }

  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  resetMockApiState()
})

afterAll(() => {
  server.close()
  globalThis.fetch = platformFetch
})
