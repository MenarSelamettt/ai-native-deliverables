import { HttpResponse, http } from 'msw'
import type { LoginCredentials } from '../types/api'
import { insightChunkDelayMs, spendingInsightChunks } from './fixtures/insight'
import { serverTransactions } from './fixtures/transactions'
import { demoCredentials, demoUser } from './fixtures/user'

export type TransactionScenario = 'success' | 'empty' | 'error'
export type InsightScenario = 'success' | 'rate-limit'

// Curriculum mock-server state only. This is not production authentication architecture.
let authenticated = false
let transactionScenario: TransactionScenario = 'success'
let insightScenario: InsightScenario = 'success'

export function resetMockApiState() {
  authenticated = false
  transactionScenario = 'success'
  insightScenario = 'success'
}

export function authenticateMockSession() {
  authenticated = true
}

export function expireMockSession() {
  authenticated = false
}

export function setTransactionScenario(scenario: TransactionScenario) {
  transactionScenario = scenario
}

export function setInsightScenario(scenario: InsightScenario) {
  insightScenario = scenario
}

function createInsightStream() {
  const encoder = new TextEncoder()
  let chunkIndex = 0
  let timerId: ReturnType<typeof setTimeout> | undefined

  return new ReadableStream<Uint8Array>({
    start(controller) {
      const sendNextChunk = () => {
        controller.enqueue(encoder.encode(spendingInsightChunks[chunkIndex]))
        chunkIndex += 1

        if (chunkIndex === spendingInsightChunks.length) {
          controller.close()
          return
        }

        timerId = setTimeout(sendNextChunk, insightChunkDelayMs)
      }

      timerId = setTimeout(sendNextChunk, insightChunkDelayMs)
    },
    cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId)
      }
    },
  })
}

export const handlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const credentials = (await request.json()) as LoginCredentials

    if (
      credentials.email !== demoCredentials.email ||
      credentials.password !== demoCredentials.password
    ) {
      return HttpResponse.json({ message: 'Email or password is incorrect.' }, { status: 401 })
    }

    authenticated = true
    return HttpResponse.json({ user: demoUser })
  }),

  http.get('*/api/auth/me', () => {
    if (!authenticated) {
      return HttpResponse.json({ message: 'Authentication required.' }, { status: 401 })
    }

    return HttpResponse.json({ user: demoUser })
  }),

  http.post('*/api/auth/logout', () => {
    authenticated = false
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('*/api/transactions', () => {
    if (!authenticated) {
      return HttpResponse.json({ message: 'Authentication required.' }, { status: 401 })
    }

    if (transactionScenario === 'error') {
      return HttpResponse.json({ message: 'Transactions are temporarily unavailable.' }, { status: 500 })
    }

    return HttpResponse.json({
      transactions: transactionScenario === 'empty' ? [] : serverTransactions,
    })
  }),

  http.post('*/api/insights/spending', async ({ request }) => {
    if (!authenticated) {
      return HttpResponse.json({ message: 'Authentication required.' }, { status: 401 })
    }

    if (insightScenario === 'rate-limit') {
      return HttpResponse.text('Too many requests. Try again shortly.', { status: 429 })
    }

    const body = (await request.json()) as { prompt?: unknown }

    if (typeof body.prompt !== 'string' || body.prompt.length === 0) {
      return HttpResponse.text('An insight prompt is required.', { status: 400 })
    }

    return new HttpResponse(createInsightStream(), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }),
]
