import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../api/auth'
import { sessionQueryKey } from './useSessionQuery'

export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(sessionQueryKey, user)
    },
  })
}
