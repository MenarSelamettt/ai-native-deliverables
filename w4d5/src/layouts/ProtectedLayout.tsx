import { Navigate, Outlet } from 'react-router-dom'
import { useSessionQuery } from '../hooks/useSessionQuery'

export function ProtectedLayout() {
  const sessionQuery = useSessionQuery()

  if (sessionQuery.isPending) {
    return (
      <main className="auth-shell">
        <section className="auth-card async-state" role="status">
          <h1 className="async-title">Checking session...</h1>
          <p className="async-message">Confirming your protected dashboard access.</p>
        </section>
      </main>
    )
  }

  if (sessionQuery.isError) {
    return (
      <main className="auth-shell">
        <section className="auth-card async-state" role="alert">
          <h1 className="async-title">We couldn't verify your session</h1>
          <p className="async-message">{sessionQuery.error.message}</p>
        </section>
      </main>
    )
  }

  if (!sessionQuery.data) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
