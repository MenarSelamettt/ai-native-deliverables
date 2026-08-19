export type User = {
  id: string
  name: string
  email: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type UserResponse = {
  user: User
}

export type ApiErrorResponse = {
  message: string
}

export type TransactionsResponse = {
  transactions: Transaction[]
}
import type { Transaction } from './transaction'
