import type { ApiErrorResponse } from '../types/api'

export class UnauthorizedError extends Error {
  constructor(message = 'Your session is no longer valid.') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export async function getResponseErrorMessage(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as Partial<ApiErrorResponse>
    return body.message || fallback
  } catch {
    return fallback
  }
}
