import { useState, type FormEvent } from 'react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formMessage, setFormMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: Run the login mutation, handle pending/errors, and navigate after success.
    setFormMessage('The login form is ready to connect to the supplied API contract.')
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

          {formMessage ? <p className="auth-message" role="status">{formMessage}</p> : null}

          <button className="primary-button" type="submit">
            Sign in
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
