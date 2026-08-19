import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '../api/auth'

export const sessionQueryKey = ['session'] as const

export function useSessionQuery() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: getCurrentUser,
  })
}
