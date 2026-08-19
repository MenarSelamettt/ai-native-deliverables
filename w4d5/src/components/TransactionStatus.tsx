import { usePreferencesStore } from '../stores/usePreferencesStore'

type TransactionStatusProps = {
  visibleCount: number
}

export function TransactionStatus({ visibleCount }: TransactionStatusProps) {
  const category = usePreferencesStore((state) => state.category)
  const transactionLabel = `${visibleCount} ${visibleCount === 1 ? 'transaction' : 'transactions'}`
  const statusLabel = category === 'All' ? transactionLabel : `${category} · ${transactionLabel}`

  return <span className="count-badge">{statusLabel}</span>
}
