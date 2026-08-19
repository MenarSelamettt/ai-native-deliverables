import type { LoginCredentials, User, UserResponse } from '../types/api'
import { UnauthorizedError, getResponseErrorMessage } from './errors'

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (response.status === 401) {
    throw new UnauthorizedError(
      await getResponseErrorMessage(response, 'Email or password is incorrect.'),
    )
  }

  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, 'Unable to sign in right now.'))
  }

  const body = (await response.json()) as UserResponse
  return body.user
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await fetch('/api/auth/me', { credentials: 'include' })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    throw new Error(
      await getResponseErrorMessage(response, 'Unable to verify your session right now.'),
    )
  }

  const body = (await response.json()) as UserResponse
  return body.user
}

export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  if (response.status === 401) {
    return
  }

  if (!response.ok) {
    throw new Error(await getResponseErrorMessage(response, 'Unable to sign out right now.'))
  }
}
