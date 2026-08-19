import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../hooks/useLoginMutation'
import { useSessionQuery } from '../hooks/useSessionQuery'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const sessionQuery = useSessionQuery()
  const loginMutation = useLoginMutation()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      await loginMutation.mutateAsync({ email, password })
      navigate('/dashboard')
    } catch {
      // Mutation state renders the API's useful error message.
    }
  }

  if (sessionQuery.data) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="login-heading">
        <div>
          <p className="eyebrow">Protected dashboard</p>
          <h1 id="login-heading">Sign in to continue</h1>
          <p className="auth-intro">
            Access your current account summary and server-owned transaction history.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="filter-label">Email</span>
            <input
              className="search-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span className="filter-label">Password</span>
            <input
              className="search-input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {loginMutation.isError ? (
            <p className="auth-error" role="alert">{loginMutation.error.message}</p>
          ) : null}

          <button className="primary-button" type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">Demo credentials</p>
          <p><strong>Email:</strong> demo@uptimecrew.dev</p>
          <p><strong>Password:</strong> password123</p>
        </div>
      </section>
    </main>
  )
}
