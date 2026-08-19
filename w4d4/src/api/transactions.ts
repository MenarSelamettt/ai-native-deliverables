import type { Transaction } from '../types/transaction'
import type { TransactionsResponse } from '../types/api'
import { UnauthorizedError, getResponseErrorMessage } from './errors'

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch('/api/transactions', { credentials: 'include' })

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  if (!response.ok) {
    throw new Error(
      await getResponseErrorMessage(response, 'Unable to load transactions right now.'),
    )
  }

  const body = (await response.json()) as TransactionsResponse
  return body.transactions
}
