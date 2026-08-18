export class UnauthorizedError extends Error {
  constructor(message = 'Your session is no longer valid.') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}
