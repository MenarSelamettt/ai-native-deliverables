import type { Transaction } from '../types/transaction'

export async function getTransactions(): Promise<Transaction[]> {
  // TODO: GET server-owned transactions with the session-cookie fetch options and handle failures.
  throw new Error('The transaction API adapter is not implemented yet.')
}
