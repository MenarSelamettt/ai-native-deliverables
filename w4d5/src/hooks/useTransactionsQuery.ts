import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UnauthorizedError } from '../api/errors'
import { getTransactions } from '../api/transactions'
import { sessionQueryKey } from './useSessionQuery'

export const transactionsQueryKey = ['transactions'] as const

export function useTransactionsQuery() {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: transactionsQueryKey,
    queryFn: async () => {
      try {
        return await getTransactions()
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          queryClient.setQueryData(sessionQueryKey, null)
        }

        throw error
      }
    },
  })
}
