import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../api/auth'
import { sessionQueryKey } from './useSessionQuery'
import { transactionsQueryKey } from './useTransactionsQuery'

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(sessionQueryKey, null)
      queryClient.removeQueries({ queryKey: transactionsQueryKey })
    },
  })
}
