import { Outlet } from 'react-router-dom'

export function ProtectedLayout() {
  // TODO: Use server session state to handle checking, failure, and unauthenticated redirects.
  return <Outlet />
}
