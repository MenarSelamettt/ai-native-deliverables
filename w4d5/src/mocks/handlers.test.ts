import { describe, expect, it } from 'vitest'
import { completeSpendingInsight } from './fixtures/insight'
import { demoCredentials } from './fixtures/user'

describe('mock API contract', () => {
  it('supports authentication, transactions, and spending insights through HTTP', async () => {
    const initialSession = await fetch('/api/auth/me', { credentials: 'include' })
    expect(initialSession.status).toBe(401)

    const invalidLogin = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: demoCredentials.email, password: 'incorrect' }),
    })
    expect(invalidLogin.status).toBe(401)

    const validLogin = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(demoCredentials),
    })
    expect(validLogin.status).toBe(200)

    const currentSession = await fetch('/api/auth/me', { credentials: 'include' })
    expect(currentSession.status).toBe(200)

    const transactionResponse = await fetch('/api/transactions', { credentials: 'include' })
    const transactionBody = (await transactionResponse.json()) as { transactions: unknown[] }
    expect(transactionBody.transactions).toHaveLength(8)

    const insightResponse = await fetch('/api/insights/spending', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Summarize this account.' }),
    })
    expect(insightResponse.status).toBe(200)
    expect(await insightResponse.text()).toBe(completeSpendingInsight)

    const logoutResponse = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    expect(logoutResponse.status).toBe(204)

    const endedSession = await fetch('/api/auth/me', { credentials: 'include' })
    expect(endedSession.status).toBe(401)
  })
})
