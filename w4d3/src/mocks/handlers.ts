import { HttpResponse, http } from 'msw'
import type { LoginCredentials } from '../types/api'
import { serverTransactions } from './fixtures/transactions'
import { demoCredentials, demoUser } from './fixtures/user'

export type TransactionScenario = 'success' | 'empty' | 'error'

// Curriculum mock-server state only. This is not production authentication architecture.
let authenticated = false
let transactionScenario: TransactionScenario = 'success'

export function resetMockApiState() {
  authenticated = false
  transactionScenario = 'success'
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
]
