import type { LoginCredentials, User } from '../types/api'

export async function login(credentials: LoginCredentials): Promise<User> {
  void credentials
  // TODO: POST JSON credentials with the session-cookie fetch options and parse the user.
  throw new Error('The login API adapter is not implemented yet.')
}

export async function getCurrentUser(): Promise<User | null> {
  // TODO: GET the current session user and treat 401 as unauthenticated, not infrastructure failure.
  throw new Error('The session API adapter is not implemented yet.')
}

export async function logout(): Promise<void> {
  // TODO: POST logout with the session-cookie fetch options and verify the response.
  throw new Error('The logout API adapter is not implemented yet.')
}
